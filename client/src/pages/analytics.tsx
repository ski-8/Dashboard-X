import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/layout";

export default function Analytics() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/demo-dashboard"],
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Analytics</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const googleAnalyticsMetrics = dashboardData?.metrics?.filter(
    (metric: any) => metric.source === "google_analytics"
  ) || [];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Google Analytics</h1>
          </div>
          <Badge variant="secondary" className="w-fit">
            Last updated: {new Date().toLocaleDateString()}
          </Badge>
        </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {googleAnalyticsMetrics.map((metric: any, index: number) => {
          const icons = [Users, TrendingUp, BarChart3, Clock];
          const Icon = icons[index] || BarChart3;
          const colors = ["text-blue-600", "text-green-600", "text-purple-600", "text-orange-600"];
          const bgColors = ["bg-blue-50", "bg-green-50", "bg-purple-50", "bg-orange-50"];
          
          return (
            <Card key={metric.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.name}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold">
                      {metric.unit === "percentage" 
                        ? `${metric.value}%` 
                        : metric.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`${bgColors[index % bgColors.length]} p-2 rounded-lg`}>
                    <Icon className={`h-4 w-4 ${colors[index % colors.length]}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator />

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>
              Website performance metrics for the current period
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {googleAnalyticsMetrics.find((m: any) => m.name === "Sessions")?.value?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-muted-foreground">Total Sessions</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {googleAnalyticsMetrics.find((m: any) => m.name === "Page Views")?.value?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-muted-foreground">Page Views</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>
              How users interact with your website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {googleAnalyticsMetrics.find((m: any) => m.name === "Bounce Rate")?.value || "0"}%
                </div>
                <div className="text-sm text-muted-foreground">Bounce Rate</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round((googleAnalyticsMetrics.find((m: any) => m.name === "Avg Session Duration")?.value || 0) / 60)}m
                </div>
                <div className="text-sm text-muted-foreground">Avg Duration</div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}