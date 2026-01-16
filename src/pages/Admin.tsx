import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPostList from "@/components/admin/BlogPostList";
import TagManager from "@/components/admin/TagManager";
import CategoryManager from "@/components/admin/CategoryManager";
import NewsletterSubscribers from "@/components/admin/NewsletterSubscribers";
import MediaLibrary from "@/components/admin/MediaLibrary";
import ActivityLogs from "@/components/admin/ActivityLogs";
import { LogOut, LayoutDashboard, FileText, Tags, Mail, Image, FolderTree, Activity } from "lucide-react";

const Admin = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your Fact Fit content</p>
            </div>
          </div>
          <Button onClick={signOut} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full max-w-4xl grid-cols-6 mb-8">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Posts</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderTree className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Media</span>
            </TabsTrigger>
            <TabsTrigger value="tags" className="flex items-center gap-2">
              <Tags className="h-4 w-4" />
              <span className="hidden sm:inline">Tags</span>
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Subscribers</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-0">
            <BlogPostList />
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="media" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Media Library
                </CardTitle>
                <CardDescription>
                  Browse, manage, and delete uploaded images. Click an image to copy its URL.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MediaLibrary 
                  mode="browse" 
                  onSelect={(url) => {
                    navigator.clipboard.writeText(url);
                    import("sonner").then(({ toast }) => {
                      toast.success("Image URL copied to clipboard!");
                    });
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tags" className="mt-0">
            <TagManager />
          </TabsContent>
          
          <TabsContent value="subscribers" className="mt-0">
            <NewsletterSubscribers />
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <ActivityLogs />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;