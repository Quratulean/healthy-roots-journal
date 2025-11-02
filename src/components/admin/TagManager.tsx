import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { z } from "zod";

const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50),
});

const TagManager = () => {
  const [tagName, setTagName] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: tags, isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      tagSchema.parse({ name: tagName });

      const slug = generateSlug(tagName);
      const { error } = await supabase.from("tags").insert({
        name: tagName,
        slug,
      });

      if (error) throw error;

      toast.success("Tag created successfully!");
      setTagName("");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error.code === "23505") {
        toast.error("A tag with this name already exists");
      } else {
        toast.error(error.message || "Failed to create tag");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      const { error } = await supabase.from("tags").delete().eq("id", id);
      if (error) throw error;

      toast.success("Tag deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete tag");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Tag</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTag} className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="tagName">Tag Name</Label>
              <Input
                id="tagName"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                required
                maxLength={50}
                placeholder="e.g., Wellness"
              />
            </div>
            <Button type="submit" disabled={loading} className="mt-8">
              {loading ? "Creating..." : "Create Tag"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Tags</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading tags...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-sm py-2 px-3">
                  {tag.name}
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="ml-2 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {tags?.length === 0 && (
                <p className="text-muted-foreground">No tags created yet</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TagManager;
