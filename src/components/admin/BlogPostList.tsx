import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  Trash2, 
  Edit, 
  MoreHorizontal, 
  Eye, 
  EyeOff, 
  Search,
  Plus,
  FileText,
  Calendar,
  ExternalLink,
  Clock,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import BlogPostForm from "./BlogPostForm";

type PostStatus = "draft" | "editor_review" | "scheduled" | "published";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  status: PostStatus | null;
  published: boolean | null;
  scheduled_at: string | null;
  published_at: string | null;
  view_count: number | null;
  needs_update: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

const statusConfig: Record<PostStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: typeof FileText }> = {
  draft: { label: "Draft", variant: "secondary", icon: FileText },
  editor_review: { label: "In Review", variant: "outline", icon: Clock },
  scheduled: { label: "Scheduled", variant: "outline", icon: Calendar },
  published: { label: "Published", variant: "default", icon: CheckCircle2 },
};

const BlogPostList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const filteredPosts = posts?.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      post.status === statusFilter ||
      (statusFilter === "needs_update" && post.needs_update);
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    if (!deletePostId) return;

    try {
      await supabase.from("post_tags").delete().eq("post_id", deletePostId);
      await supabase.from("post_categories").delete().eq("post_id", deletePostId);
      const { error } = await supabase.from("blog_posts").delete().eq("id", deletePostId);
      if (error) throw error;

      await logActivity("delete_post", "blog_post", deletePostId);
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete post");
    } finally {
      setDeletePostId(null);
    }
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

  const updatePostStatus = async (id: string, newStatus: PostStatus) => {
    try {
      const updates: any = { status: newStatus };
      if (newStatus === "published") {
        updates.published = true;
        updates.published_at = new Date().toISOString();
      } else {
        updates.published = false;
      }

      const { error } = await supabase
        .from("blog_posts")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      await logActivity("update_status", "blog_post", id, { new_status: newStatus });
      toast.success(`Post status updated to ${statusConfig[newStatus].label}`);
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to update post");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(filteredPosts?.map(p => p.id) || []);
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectPost = (postId: string, checked: boolean) => {
    if (checked) {
      setSelectedPosts(prev => [...prev, postId]);
    } else {
      setSelectedPosts(prev => prev.filter(id => id !== postId));
    }
  };

  const executeBulkAction = async () => {
    if (!bulkAction || selectedPosts.length === 0) return;

    try {
      if (bulkAction === "delete") {
        for (const postId of selectedPosts) {
          await supabase.from("post_tags").delete().eq("post_id", postId);
          await supabase.from("post_categories").delete().eq("post_id", postId);
          await supabase.from("blog_posts").delete().eq("id", postId);
        }
        await logActivity("bulk_delete", "blog_posts", undefined, { count: selectedPosts.length });
        toast.success(`${selectedPosts.length} posts deleted`);
      } else if (bulkAction === "publish") {
        await supabase
          .from("blog_posts")
          .update({ status: "published", published: true, published_at: new Date().toISOString() })
          .in("id", selectedPosts);
        await logActivity("bulk_publish", "blog_posts", undefined, { count: selectedPosts.length });
        toast.success(`${selectedPosts.length} posts published`);
      } else if (bulkAction === "unpublish") {
        await supabase
          .from("blog_posts")
          .update({ status: "draft", published: false })
          .in("id", selectedPosts);
        await logActivity("bulk_unpublish", "blog_posts", undefined, { count: selectedPosts.length });
        toast.success(`${selectedPosts.length} posts unpublished`);
      }

      setSelectedPosts([]);
      setBulkAction("");
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    } catch (error: any) {
      toast.error(error.message || "Bulk action failed");
    } finally {
      setShowBulkConfirm(false);
    }
  };

  const getStatusDisplay = (post: BlogPost) => {
    const status = post.status || (post.published ? "published" : "draft");
    const config = statusConfig[status as PostStatus] || statusConfig.draft;
    return (
      <Badge variant={config.variant} className="gap-1">
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // Stats calculation
  const stats = {
    total: posts?.length || 0,
    published: posts?.filter(p => p.status === "published" || p.published).length || 0,
    drafts: posts?.filter(p => p.status === "draft" || (!p.published && !p.status)).length || 0,
    scheduled: posts?.filter(p => p.status === "scheduled").length || 0,
    needsUpdate: posts?.filter(p => p.needs_update).length || 0,
  };

  if (isCreating || editingPostId) {
    return (
      <BlogPostForm
        postId={editingPostId || undefined}
        onBack={() => {
          setIsCreating(false);
          setEditingPostId(null);
        }}
        onSuccess={() => {
          setIsCreating(false);
          setEditingPostId(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Blog Posts</h2>
          <p className="text-muted-foreground">
            Manage your blog posts and articles
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.drafts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-orange-500" />
              Needs Update
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.needsUpdate}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
            <SelectItem value="editor_review">In Review</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="needs_update">Needs Update</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="py-3 flex items-center gap-4">
            <span className="text-sm font-medium">
              {selectedPosts.length} selected
            </span>
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Bulk action..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="publish">Publish All</SelectItem>
                <SelectItem value="unpublish">Unpublish All</SelectItem>
                <SelectItem value="delete">Delete All</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              disabled={!bulkAction}
              onClick={() => setShowBulkConfirm(true)}
            >
              Apply
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedPosts([])}
            >
              Clear
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Posts Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : filteredPosts?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by creating your first post"}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedPosts.length === filteredPosts?.length && filteredPosts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts?.map((post) => (
                  <TableRow key={post.id} className={post.needs_update ? "bg-orange-50/50" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPosts.includes(post.id)}
                        onCheckedChange={(checked) => handleSelectPost(post.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        {post.featured_image && (
                          <img
                            src={post.featured_image}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{post.title}</p>
                            {post.needs_update && (
                              <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                            )}
                          </div>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground truncate max-w-md">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getStatusDisplay(post)}
                        {post.status === "scheduled" && post.scheduled_at && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.scheduled_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{post.view_count || 0}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.created_at!).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingPostId(post.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => updatePostStatus(post.id, "draft")}>
                            <FileText className="h-4 w-4 mr-2" />
                            Set as Draft
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updatePostStatus(post.id, "editor_review")}>
                            <Clock className="h-4 w-4 mr-2" />
                            Send to Review
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updatePostStatus(post.id, "published")}>
                            <Eye className="h-4 w-4 mr-2" />
                            Publish
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => window.open(`/blog/${post.slug}`, "_blank")}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeletePostId(post.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Action Confirmation */}
      <AlertDialog open={showBulkConfirm} onOpenChange={setShowBulkConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {bulkAction} {selectedPosts.length} posts?
              {bulkAction === "delete" && " This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeBulkAction}
              className={bulkAction === "delete" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              {bulkAction === "delete" ? "Delete All" : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogPostList;