import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const siteUrl = url.searchParams.get('site_url') || 'https://yourdomain.com';
    
    // Generate robots.txt content for health blog
    const robotsTxt = `# Robots.txt for Health Blog CMS
# Generated dynamically

User-agent: *
Allow: /
Allow: /blog/
Allow: /category/
Allow: /tag/
Allow: /about
Allow: /contact

# Disallow admin and private areas
Disallow: /admin
Disallow: /admin/
Disallow: /auth
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Disallow search result pages (prevent duplicate content)
Disallow: /*?*

# Allow important query parameters for pagination
Allow: /blog?page=

# Crawl-delay for polite crawling
Crawl-delay: 1

# Sitemaps
Sitemap: ${siteUrl}/sitemap.xml

# Google specific
User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /auth

# Bing specific  
User-agent: Bingbot
Allow: /
Disallow: /admin
Disallow: /auth

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Allow social media crawlers for rich previews
User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: LinkedInBot
Allow: /
`;

    console.log('Generated robots.txt successfully');

    return new Response(robotsTxt, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });

  } catch (error) {
    console.error('Error generating robots.txt:', error);
    return new Response(
      `# Error generating robots.txt\nUser-agent: *\nAllow: /`,
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain; charset=utf-8',
        },
      }
    );
  }
});
