import { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, AlertTriangle, Shield } from "lucide-react";
import { format } from "date-fns";

interface Disclaimer {
  id: string;
  name: string;
  content: string;
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

const DisclaimerManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDisclaimer, setEditingDisclaimer] = useState<Disclaimer | null>(null);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: disclaimers, isLoading } = useQuery({
    queryKey: ["disclaimers-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("disclaimers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Disclaimer[];
    },
  });

  const resetForm = () => {
    setName("");
    setContent("");
    setIsActive(true);
    setEditingDisclaimer(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (disclaimer: Disclaimer) => {
    setEditingDisclaimer(disclaimer);
    setName(disclaimer.name);
    setContent(disclaimer.content);
    setIsActive(disclaimer.is_active);
    setIsDialogOpen(true);
  };

  const logActivity = async (action: string, entityId?: string, details?: object) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("admin_activity_logs").insert({
        user_id: user.id,
        action,
        entity_type: "disclaimer",
        entity_id: entityId,
        details: details as any,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      toast.error("Name and content are required");
      return;
    }

    setLoading(true);
    try {
      if (editingDisclaimer) {
        // Update existing disclaimer with incremented version
        const { error } = await supabase
          .from("disclaimers")
          .update({
            name: name.trim(),
            content: content.trim(),
            is_active: isActive,
            version: editingDisclaimer.version + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingDisclaimer.id);

        if (error) throw error;
        await logActivity("update_disclaimer", editingDisclaimer.id, { name, version: editingDisclaimer.version + 1 });
        toast.success("Disclaimer updated successfully!");
      } else {
        // Create new disclaimer
        const { data, error } = await supabase
          .from("disclaimers")
          .insert({
            name: name.trim(),
            content: content.trim(),
            is_active: isActive,
          })
          .select()
          .single();

        if (error) throw error;
        await logActivity("create_disclaimer", data.id, { name });
        toast.success("Disclaimer created successfully!");
      }

      queryClient.invalidateQueries({ queryKey: ["disclaimers-admin"] });
      queryClient.invalidateQueries({ queryKey: ["disclaimer"] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to save disclaimer");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (disclaimer: Disclaimer) => {
    if (!confirm(`Are you sure you want to delete "${disclaimer.name}"?`)) return;

    try {
      const { error } = await supabase
        .from("disclaimers")
        .delete()
        .eq("id", disclaimer.id);

      if (error) throw error;
      await logActivity("delete_disclaimer", disclaimer.id, { name: disclaimer.name });
      toast.success("Disclaimer deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["disclaimers-admin"] });
      queryClient.invalidateQueries({ queryKey: ["disclaimer"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete disclaimer");
    }
  };

  const toggleActive = async (disclaimer: Disclaimer) => {
    try {
      const { error } = await supabase
        .from("disclaimers")
        .update({ is_active: !disclaimer.is_active, updated_at: new Date().toISOString() })
        .eq("id", disclaimer.id);

      if (error) throw error;
      await logActivity("toggle_disclaimer", disclaimer.id, { 
        name: disclaimer.name, 
        is_active: !disclaimer.is_active 
      });
      toast.success(`Disclaimer ${!disclaimer.is_active ? "activated" : "deactivated"}`);
      queryClient.invalidateQueries({ queryKey: ["disclaimers-admin"] });
      queryClient.invalidateQueries({ queryKey: ["disclaimer"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to update disclaimer");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading disclaimers...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Shield className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle>Medical Disclaimers</CardTitle>
              <CardDescription>
                Manage legal disclaimers that appear on blog posts
              </CardDescription>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Disclaimer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingDisclaimer ? "Edit Disclaimer" : "Create Disclaimer"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., General Medical Disclaimer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter the disclaimer text..."
                    rows={6}
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>

                {/* Preview */}
                {content && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-orange-700 font-medium text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      Preview
                    </div>
                    <p className="text-sm text-orange-800">{content}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : editingDisclaimer ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {disclaimers && disclaimers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disclaimers.map((disclaimer) => (
                <TableRow key={disclaimer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{disclaimer.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {disclaimer.content.substring(0, 60)}...
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={disclaimer.is_active ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleActive(disclaimer)}
                    >
                      {disclaimer.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>v{disclaimer.version}</TableCell>
                  <TableCell>
                    {format(new Date(disclaimer.updated_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(disclaimer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(disclaimer)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No disclaimers found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first medical disclaimer to display on blog posts
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DisclaimerManager;
