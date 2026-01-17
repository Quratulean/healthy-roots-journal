import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BlogPost {
  slug: string;
  updated_at: string | null;
  published_at: string | null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the site URL from request or use default
    const url = new URL(req.url);
    const siteUrl = url.searchParams.get("site_url") || "https://factfit.com";

    console.log("Generating sitemap for:", siteUrl);

    // Fetch all published blog posts
    const { data: posts, error: postsError } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (postsError) {
      console.error("Error fetching posts:", postsError);
      throw postsError;
    }

    // Fetch all categories
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("slug");

    if (catError) {
      console.error("Error fetching categories:", catError);
    }

    // Static pages
    const staticPages = [
      { loc: "/", priority: "1.0", changefreq: "daily" },
      { loc: "/about", priority: "0.8", changefreq: "monthly" },
      { loc: "/contact", priority: "0.6", changefreq: "monthly" },
      { loc: "/articles", priority: "0.9", changefreq: "daily" },
      { loc: "/newsletter", priority: "0.7", changefreq: "monthly" },
      { loc: "/faq", priority: "0.5", changefreq: "monthly" },
      { loc: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
      { loc: "/terms-of-service", priority: "0.3", changefreq: "yearly" },
      { loc: "/wellness", priority: "0.8", changefreq: "weekly" },
      { loc: "/nutrition", priority: "0.8", changefreq: "weekly" },
      { loc: "/fitness", priority: "0.8", changefreq: "weekly" },
      { loc: "/mental-health", priority: "0.8", changefreq: "weekly" },
      { loc: "/sleep", priority: "0.8", changefreq: "weekly" },
      { loc: "/beauty", priority: "0.8", changefreq: "weekly" },
      { loc: "/lifestyle", priority: "0.8", changefreq: "weekly" },
    ];

    const today = new Date().toISOString().split("T")[0];

    // Generate XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Add static pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${siteUrl}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Add blog posts
    if (posts && posts.length > 0) {
      for (const post of posts as BlogPost[]) {
        const lastmod = post.updated_at || post.published_at || today;
        const formattedDate = new Date(lastmod).toISOString().split("T")[0];
        
        xml += `  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${formattedDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      }
    }

    // Add category pages from database
    if (categories && categories.length > 0) {
      for (const category of categories) {
        xml += `  <url>
    <loc>${siteUrl}/category/${category.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
      }
    }

    xml += `</urlset>`;

    console.log(`Sitemap generated with ${staticPages.length} static pages and ${posts?.length || 0} blog posts`);

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error generating sitemap:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
