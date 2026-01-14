import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Trash2, 
  Search, 
  Image as ImageIcon, 
  Loader2,
  Check,
  X,
  Upload,
  FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  created_at: string;
}

interface MediaLibraryProps {
  onSelect?: (url: string) => void;
  selectedUrl?: string;
  mode?: "browse" | "select";
}

const MediaLibrary = ({ onSelect, selectedUrl, mode = "browse" }: MediaLibraryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [deleting, setDeleting] = useState(false);
  const queryClient = useQueryClient();

  const { data: files, isLoading, error } = useQuery({
    queryKey: ["media-library"],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from("blog-images")
        .list("posts", {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      // Filter out folders and get public URLs
      const mediaFiles: MediaFile[] = (data || [])
        .filter((file) => file.id && !file.name.endsWith("/"))
        .map((file) => {
          const { data: { publicUrl } } = supabase.storage
            .from("blog-images")
            .getPublicUrl(`posts/${file.name}`);

          return {
            id: file.id!,
            name: file.name,
            url: publicUrl,
            size: file.metadata?.size || 0,
            created_at: file.created_at || "",
          };
        });

      return mediaFiles;
    },
  });

  const filteredFiles = files?.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const { error } = await supabase.storage
        .from("blog-images")
        .remove([`posts/${deleteTarget.name}`]);

      if (error) throw error;

      toast.success("Image deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["media-library"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete image");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "Unknown size";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load media library</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Grid */}
      {filteredFiles && filteredFiles.length > 0 ? (
        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pr-4">
            {filteredFiles.map((file) => {
              const isSelected = selectedUrl === file.url;
              return (
                <div
                  key={file.id}
                  className={cn(
                    "group relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all",
                    isSelected
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-muted-foreground/30"
                  )}
                  onClick={() => onSelect?.(file.url)}
                >
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                    <p className="text-white text-xs truncate font-medium">
                      {file.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-white/70 text-xs">
                        {formatFileSize(file.size)}
                      </span>
                      {mode === "browse" && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(file);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <p className="mt-2 text-muted-foreground">
            {searchQuery ? "No images match your search" : "No images uploaded yet"}
          </p>
        </div>
      )}

      {/* Stats */}
      {files && files.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {filteredFiles?.length} of {files.length} images
        </p>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MediaLibrary;
