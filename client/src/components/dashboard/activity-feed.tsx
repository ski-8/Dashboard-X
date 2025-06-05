import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Activity, ActionItem } from "@shared/schema";

interface ActivityFeedProps {
  activities: Activity[];
  actionItems: ActionItem[];
}

export default function ActivityFeed({ activities, actionItems }: ActivityFeedProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest("PATCH", `/api/action-items/${itemId}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update action item",
        variant: "destructive",
      });
    },
  });

  const handleToggleItem = (itemId: number) => {
    toggleItemMutation.mutate(itemId);
  };

  // Sample data if no real data available
  const displayActivities = activities.length > 0 ? activities : [
    {
      id: 1,
      type: "lead",
      description: "New lead from website form",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 2,
      type: "campaign_update",
      description: "LinkedIn campaign updated",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      id: 3,
      type: "milestone",
      description: "Call tracking milestone reached",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
  ];

  const displayActionItems = actionItems.length > 0 ? actionItems : [
    {
      id: 1,
      title: "Review Q4 strategy",
      completed: false,
    },
    {
      id: 2,
      title: "Update LinkedIn ads",
      completed: true,
    },
    {
      id: 3,
      title: "Schedule team meeting",
      completed: false,
    },
  ];

  const getActivityColor = (type: string) => {
    const colors = {
      lead: "bg-green-500",
      campaign_update: "bg-blue-500",
      milestone: "bg-yellow-500",
      file_upload: "bg-purple-500",
    };
    return colors[type as keyof typeof colors] || "bg-gray-500";
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {displayActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div 
                className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTimeAgo(new Date(activity.createdAt))}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">Action Items</h4>
          <div className="space-y-2">
            {displayActionItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => handleToggleItem(item.id)}
                  disabled={toggleItemMutation.isPending}
                />
                <span 
                  className={`text-sm ${
                    item.completed 
                      ? "text-muted-foreground line-through" 
                      : "text-foreground"
                  }`}
                >
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
