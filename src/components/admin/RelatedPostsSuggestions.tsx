import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, ExternalLink, Loader2 } from "lucide-react";

interface RelatedPostsSuggestionsProps {
  postId?: string;
  selectedCategories: string[];
  selectedTags: string[];
  onInsertLink: (title: string, slug: string) => void;
}

const RelatedPostsSuggestions = ({
  postId,
  selectedCategories,
  selectedTags,
  onInsertLink,
}: RelatedPostsSuggestionsProps) => {
  // Fetch related posts based on categories
  const { data: categoryPosts, isLoading: loadingCategories } = useQuery({
    queryKey: ["related-posts-categories", selectedCategories, postId],
    queryFn: async () => {
      if (selectedCategories.length === 0) return [];

      // Get post IDs from same categories
      const { data: postCategories, error: pcError } = await supabase
        .from("post_categories")
        .select("post_id")
        .in("category_id", selectedCategories);

      if (pcError) throw pcError;

      const relatedPostIds = [...new Set(postCategories?.map((pc) => pc.post_id) || [])];
      const filteredIds = relatedPostIds.filter((id) => id !== postId);

      if (filteredIds.length === 0) return [];

      const { data: posts, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, published")
        .in("id", filteredIds.slice(0, 5))
        .eq("published", true);

      if (error) throw error;
      return posts || [];
    },
    enabled: selectedCategories.length > 0,
  });

  // Fetch related posts based on tags
  const { data: tagPosts, isLoading: loadingTags } = useQuery({
    queryKey: ["related-posts-tags", selectedTags, postId],
    queryFn: async () => {
      if (selectedTags.length === 0) return [];

      // Get post IDs from same tags
      const { data: postTags, error: ptError } = await supabase
        .from("post_tags")
        .select("post_id")
        .in("tag_id", selectedTags);

      if (ptError) throw ptError;

      const relatedPostIds = [...new Set(postTags?.map((pt) => pt.post_id) || [])];
      const filteredIds = relatedPostIds.filter((id) => id !== postId);

      if (filteredIds.length === 0) return [];

      const { data: posts, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, published")
        .in("id", filteredIds.slice(0, 5))
        .eq("published", true);

      if (error) throw error;
      return posts || [];
    },
    enabled: selectedTags.length > 0,
  });

  // Merge and deduplicate posts
  const allPosts = [...(categoryPosts || []), ...(tagPosts || [])];
  const uniquePosts = allPosts.reduce((acc, post) => {
    if (!acc.find((p) => p.id === post.id)) {
      acc.push(post);
    }
    return acc;
  }, [] as typeof allPosts);

  const isLoading = loadingCategories || loadingTags;
  const hasSuggestions = uniquePosts.length > 0;

  if (!selectedCategories.length && !selectedTags.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Link2 className="h-4 w-4" />
            Internal Linking
          </CardTitle>
          <CardDescription>
            Select categories or tags to see related posts
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Link2 className="h-4 w-4" />
          Internal Linking
        </CardTitle>
        <CardDescription>
          Link to related posts for better SEO
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : hasSuggestions ? (
          <div className="space-y-3">
            {uniquePosts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="flex items-start justify-between gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    /blog/{post.slug}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onInsertLink(post.title, post.slug)}
                  title="Insert link into content"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No related posts found
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RelatedPostsSuggestions;
