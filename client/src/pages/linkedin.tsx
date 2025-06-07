import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Linkedin, Eye, MousePointer, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function LinkedinAnalytics() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/demo-dashboard"],
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Linkedin className="h-6 w-6" />
          <h1 className="text-2xl font-bold">LinkedIn Analytics</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const linkedinMetrics = dashboardData?.metrics?.filter(
    (metric: any) => metric.source === "linkedin"
  ) || [];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Linkedin className="h-6 w-6 text-blue-700" />
          <h1 className="text-2xl font-bold">LinkedIn Analytics</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Badge variant="secondary" className="w-fit">
            Last updated: {new Date().toLocaleDateString()}
          </Badge>
          <Button size="sm" variant="outline">
            Sync LinkedIn Data
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {linkedinMetrics.map((metric: any, index: number) => {
          const icons = [Eye, MousePointer, TrendingUp];
          const Icon = icons[index] || Eye;
          const colors = ["text-blue-700", "text-green-600", "text-purple-600"];
          const bgColors = ["bg-blue-50", "bg-green-50", "bg-purple-50"];
          
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

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>
              Your LinkedIn campaign metrics overview
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  {linkedinMetrics.find((m: any) => m.name === "Impressions")?.value?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-muted-foreground">Total Impressions</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {linkedinMetrics.find((m: any) => m.name === "Clicks")?.value?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-muted-foreground">Total Clicks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Insights</CardTitle>
            <CardDescription>
              How your audience engages with your content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {linkedinMetrics.find((m: any) => m.name === "Engagement Rate")?.value || "0"}%
              </div>
              <div className="text-sm text-muted-foreground mt-2">Engagement Rate</div>
              <div className="text-xs text-muted-foreground mt-1">
                Above industry average of 4.2%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Breakdown</CardTitle>
          <CardDescription>
            Detailed performance metrics for your LinkedIn campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-700">Organic Reach</h4>
              <div className="text-2xl font-bold">45%</div>
              <p className="text-sm text-muted-foreground">
                Natural discovery and sharing
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">Paid Reach</h4>
              <div className="text-2xl font-bold">35%</div>
              <p className="text-sm text-muted-foreground">
                Sponsored content performance
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-600">Direct Engagement</h4>
              <div className="text-2xl font-bold">20%</div>
              <p className="text-sm text-muted-foreground">
                Comments, likes, and shares
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}