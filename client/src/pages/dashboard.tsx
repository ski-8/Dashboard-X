import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import KPICards from "@/components/dashboard/kpi-cards";
import Charts from "@/components/dashboard/charts";
import AgentTable from "@/components/dashboard/agent-table";
import ActivityFeed from "@/components/dashboard/activity-feed";
import FileSharing from "@/components/dashboard/file-sharing";
import Comments from "@/components/dashboard/comments";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: dashboardData, isLoading: isDashboardLoading, error } = useQuery({
    queryKey: ["/api/dashboard"],
    retry: false,
  });

  if (error && isUnauthorizedError(error as Error)) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

  if (isLoading || isDashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground mb-2">Unable to load dashboard</h1>
          <p className="text-muted-foreground">Please try refreshing the page or contact support.</p>
        </div>
      </div>
    );
  }

  const handleOpenChat = () => {
    // In a real implementation, this would open a chat widget
    toast({
      title: "Support Chat",
      description: "Chat support would open here in a real implementation.",
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Navigation */}
      <Sidebar client={dashboardData?.client} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <Header />

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* KPI Overview Cards */}
          <div className="mb-8">
            <KPICards metrics={dashboardData?.metrics || []} />
          </div>

          {/* Charts and Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Charts metrics={dashboardData?.metrics || []} />
          </div>

          {/* Data Tables and Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <AgentTable agents={dashboardData?.callAgents || []} />
            </div>
            <ActivityFeed 
              activities={dashboardData?.activities || []}
              actionItems={dashboardData?.actionItems || []}
            />
          </div>

          {/* File Sharing & Comments Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FileSharing files={dashboardData?.files || []} />
            <Comments comments={dashboardData?.comments || []} />
          </div>
        </main>
      </div>

      {/* Support Chat Button */}
      <Button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 p-0"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}
