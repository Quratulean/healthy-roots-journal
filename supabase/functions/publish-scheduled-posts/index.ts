import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date().toISOString();
    console.log("Checking for scheduled posts to publish at:", now);

    // Find all posts that are scheduled and past their scheduled time
    const { data: scheduledPosts, error: fetchError } = await supabase
      .from("blog_posts")
      .select("id, title, slug, scheduled_at")
      .eq("status", "scheduled")
      .eq("published", false)
      .lte("scheduled_at", now);

    if (fetchError) {
      console.error("Error fetching scheduled posts:", fetchError);
      throw fetchError;
    }

    if (!scheduledPosts || scheduledPosts.length === 0) {
      console.log("No posts to publish");
      return new Response(
        JSON.stringify({ message: "No posts to publish", published: 0 }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Found ${scheduledPosts.length} posts to publish`);

    const publishedPosts = [];
    const errors = [];

    for (const post of scheduledPosts) {
      const { error: updateError } = await supabase
        .from("blog_posts")
        .update({
          status: "published",
          published: true,
          published_at: now,
        })
        .eq("id", post.id);

      if (updateError) {
        console.error(`Failed to publish post ${post.id}:`, updateError);
        errors.push({ id: post.id, title: post.title, error: updateError.message });
      } else {
        console.log(`Published post: ${post.title} (${post.slug})`);
        publishedPosts.push({ id: post.id, title: post.title, slug: post.slug });

        // Log the activity
        await supabase.from("admin_activity_logs").insert({
          user_id: "00000000-0000-0000-0000-000000000000", // System user
          action: "auto_publish_scheduled",
          entity_type: "blog_post",
          entity_id: post.id,
          details: { title: post.title, scheduled_at: post.scheduled_at },
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Published ${publishedPosts.length} posts`,
        published: publishedPosts.length,
        posts: publishedPosts,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in publish-scheduled-posts:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
