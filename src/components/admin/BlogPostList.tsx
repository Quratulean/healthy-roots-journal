import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const BlogPostList = () => {
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;

      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete post");
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ published: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Post ${!currentStatus ? "published" : "unpublished"}`);
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to update post");
    }
  };

  if (isLoading) {
    return <p>Loading posts...</p>;
  }

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  {post.title}
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {new Date(post.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => togglePublish(post.id, post.published)}
                >
                  {post.published ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          {post.excerpt && (
            <CardContent>
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default BlogPostList;
