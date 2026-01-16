import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, FileText, Trash2, Edit, Eye, Users } from "lucide-react";
import { format } from "date-fns";

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: any;
  created_at: string | null;
}

const actionConfig: Record<string, { icon: typeof Activity; color: string; label: string }> = {
  create_post: { icon: FileText, color: "text-green-600", label: "Created post" },
  update_post: { icon: Edit, color: "text-blue-600", label: "Updated post" },
  delete_post: { icon: Trash2, color: "text-red-600", label: "Deleted post" },
  update_status: { icon: Eye, color: "text-purple-600", label: "Changed status" },
  bulk_publish: { icon: Eye, color: "text-green-600", label: "Bulk published" },
  bulk_unpublish: { icon: Eye, color: "text-orange-600", label: "Bulk unpublished" },
  bulk_delete: { icon: Trash2, color: "text-red-600", label: "Bulk deleted" },
  login: { icon: Users, color: "text-blue-600", label: "Logged in" },
};

const ActivityLogs = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as ActivityLog[];
    },
  });

  const getActionConfig = (action: string) => {
    return actionConfig[action] || { icon: Activity, color: "text-gray-600", label: action };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6" />
          Activity Logs
        </h2>
        <p className="text-muted-foreground">
          Recent admin activity and changes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Last 100 admin actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading activity...</p>
            </div>
          ) : logs?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No activity yet</h3>
              <p className="text-muted-foreground">
                Admin actions will appear here
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {logs?.map((log) => {
                  const config = getActionConfig(log.action);
                  const Icon = config.icon;

                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-2 rounded-full bg-muted ${config.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{config.label}</span>
                          {log.entity_type && (
                            <Badge variant="outline" className="text-xs">
                              {log.entity_type}
                            </Badge>
                          )}
                        </div>
                        {log.details && (
                          <p className="text-sm text-muted-foreground mt-1 truncate">
                            {log.details.title || log.details.new_status || 
                             (log.details.count && `${log.details.count} items`)}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {log.created_at && format(new Date(log.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogs;