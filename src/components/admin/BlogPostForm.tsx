import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { Save, Eye, ArrowLeft, Image as ImageIcon, Calendar, Search as SearchIcon, FileText } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import ImageUpload from "./ImageUpload";
import RelatedPostsSuggestions from "./RelatedPostsSuggestions";

type PostStatus = "draft" | "editor_review" | "scheduled" | "published";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().url("Invalid URL").or(z.literal("")).optional(),
});

interface BlogPostFormProps {
  postId?: string;
  onBack: () => void;
  onSuccess?: () => void;
}

const BlogPostForm = ({ postId, onBack, onSuccess }: BlogPostFormProps) => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<PostStatus>("draft");
  const [scheduledAt, setScheduledAt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!postId);
  const queryClient = useQueryClient();

  // Fetch available tags
  const { data: tags } = useQuery({
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

  // Fetch available categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch existing post if editing
  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        try {
          const { data: post, error } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("id", postId)
            .maybeSingle();

          if (error) throw error;
          if (post) {
            setTitle(post.title);
            setExcerpt(post.excerpt || "");
            setContent(post.content);
            setImageUrl((post as any).featured_image || (post as any).image_url || "");
            setStatus((post as any).status || (post.published ? "published" : "draft"));
            setScheduledAt((post as any).scheduled_at ? new Date((post as any).scheduled_at).toISOString().slice(0, 16) : "");
            setSeoTitle((post as any).seo_title || "");
            setSeoDescription((post as any).seo_description || "");
          }

          // Fetch post tags
          const { data: postTags, error: tagsError } = await supabase
            .from("post_tags")
            .select("tag_id")
            .eq("post_id", postId);

          if (tagsError) throw tagsError;
          setSelectedTags(postTags?.map((pt) => pt.tag_id) || []);

          // Fetch post categories
          const { data: postCategories, error: catError } = await supabase
            .from("post_categories")
            .select("category_id")
            .eq("post_id", postId);

          if (!catError && postCategories) {
            setSelectedCategories(postCategories.map((pc) => pc.category_id));
          }
        } catch (error: any) {
          toast.error("Failed to load post");
          console.error(error);
        } finally {
          setInitialLoading(false);
        }
      };
      fetchPost();
    }
  }, [postId]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const logActivity = async (action: string, entityType: string, entityId?: string, details?: object) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("admin_activity_logs").insert({
        user_id: user.id,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details: details as any,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = { title, excerpt, content, imageUrl };
      postSchema.parse(data);

      const slug = generateSlug(title);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const readingTime = calculateReadingTime(content);
      const isPublished = status === "published";

      const postData: any = {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        featured_image: imageUrl || null,
        status,
        published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
        scheduled_at: status === "scheduled" && scheduledAt ? new Date(scheduledAt).toISOString() : null,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        reading_time: readingTime,
        author_id: user.id,
      };

      let savedPostId = postId;

      if (postId) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", postId);
        if (error) throw error;
        await logActivity("update_post", "blog_post", postId, { title });
      } else {
        const { data: newPost, error } = await supabase
          .from("blog_posts")
          .insert(postData)
          .select()
          .single();
        if (error) throw error;
        savedPostId = newPost.id;
        await logActivity("create_post", "blog_post", savedPostId, { title });
      }

      // Update tags
      if (savedPostId) {
        await supabase.from("post_tags").delete().eq("post_id", savedPostId);
        if (selectedTags.length > 0) {
          const tagInserts = selectedTags.map((tagId) => ({
            post_id: savedPostId!,
            tag_id: tagId,
          }));
          const { error: tagError } = await supabase.from("post_tags").insert(tagInserts);
          if (tagError) throw tagError;
        }

        // Update categories
        await supabase.from("post_categories").delete().eq("post_id", savedPostId);
        if (selectedCategories.length > 0) {
          const catInserts = selectedCategories.map((categoryId) => ({
            post_id: savedPostId!,
            category_id: categoryId,
          }));
          const { error: catError } = await supabase.from("post_categories").insert(catInserts);
          if (catError) throw catError;
        }
      }

      toast.success(postId ? "Post updated successfully!" : "Post created successfully!");
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      
      if (onSuccess) {
        onSuccess();
      } else {
        onBack();
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to save post");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Preview: ${title}</title>
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 40px 20px;
              line-height: 1.6;
            }
            img { max-width: 100%; height: auto; border-radius: 8px; }
            h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
            .excerpt { color: #666; font-size: 1.25rem; margin-bottom: 2rem; }
            .content { margin-top: 2rem; }
            .featured-image { margin-bottom: 2rem; }
            .meta { color: #888; font-size: 0.875rem; margin-bottom: 1rem; }
          </style>
        </head>
        <body>
          ${imageUrl ? `<img src="${imageUrl}" alt="${title}" class="featured-image" />` : ""}
          <h1>${title}</h1>
          <p class="meta">${calculateReadingTime(content)} min read</p>
          ${excerpt ? `<p class="excerpt">${excerpt}</p>` : ""}
          <div class="content">${content}</div>
        </body>
        </html>
      `);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
          <h2 className="text-2xl font-bold">
            {postId ? "Edit Post" : "Create New Post"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview} disabled={!title}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : postId ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a compelling title..."
                  required
                  maxLength={200}
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Slug: {generateSlug(title) || "..."}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A brief summary that appears in previews..."
                  rows={3}
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground">
                  {excerpt.length}/300 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label>Content *</Label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Write your article content here..."
                />
                <p className="text-xs text-muted-foreground">
                  Reading time: ~{calculateReadingTime(content)} min
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="h-4 w-4" />
                SEO Settings
              </CardTitle>
              <CardDescription>
                Optimize your post for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || "Enter SEO title..."}
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {(seoTitle || title).length}/60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea
                  id="seoDescription"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder={excerpt || "Enter meta description..."}
                  rows={2}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">
                  {(seoDescription || excerpt).length}/160 characters
                </p>
              </div>

              {/* SEO Preview */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-1">
                <p className="text-primary text-sm font-medium truncate">
                  {seoTitle || title || "Post Title"}
                </p>
                <p className="text-xs text-green-600 truncate">
                  factfit.com/blog/{generateSlug(title) || "post-slug"}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {seoDescription || excerpt || "Post excerpt will appear here..."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Publish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(value: PostStatus) => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="editor_review">Send for Review</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {status === "scheduled" && (
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Schedule Date</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Featured Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
              />
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Select categories for your post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories?.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                    className="cursor-pointer transition-colors"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
                {categories?.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No categories available. Create categories in the Categories tab.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Select relevant tags for your post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags?.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer transition-colors"
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {tags?.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No tags available. Create tags in the Tags tab.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Internal Linking Helper */}
          <RelatedPostsSuggestions
            postId={postId}
            selectedCategories={selectedCategories}
            selectedTags={selectedTags}
            onInsertLink={(title, slug) => {
              const linkHtml = `<a href="/blog/${slug}">${title}</a>`;
              setContent((prev) => prev + ` ${linkHtml}`);
              toast.success(`Link to "${title}" added to content`);
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;