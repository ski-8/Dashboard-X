import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, PhoneCall, TrendingUp, Users, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function CallTracking() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/demo-dashboard"],
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Phone className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Call Tracking</h1>
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

  const callTrackingMetrics = dashboardData?.metrics?.filter(
    (metric: any) => metric.source === "call_tracking"
  ) || [];

  const callAgents = dashboardData?.callAgents || [];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Phone className="h-6 w-6 text-green-600" />
          <h1 className="text-2xl font-bold">Call Tracking</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Badge variant="secondary" className="w-fit">
            Last updated: {new Date().toLocaleDateString()}
          </Badge>
          <Button size="sm" variant="outline">
            Generate Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {callTrackingMetrics.map((metric: any, index: number) => {
          const icons = [PhoneCall, CheckCircle, TrendingUp];
          const Icon = icons[index] || PhoneCall;
          const colors = ["text-green-600", "text-blue-600", "text-purple-600"];
          const bgColors = ["bg-green-50", "bg-blue-50", "bg-purple-50"];
          
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

      {/* Call Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Call Agents Performance</CardTitle>
          <CardDescription>
            Current status and performance metrics for your call agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid gap-4">
              {callAgents.map((agent: any) => (
                <div key={agent.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{agent.name}</h4>
                      <Badge 
                        variant={agent.status === "available" ? "default" : "secondary"}
                        className={agent.status === "available" ? "bg-green-100 text-green-800" : ""}
                      >
                        {agent.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1 sm:space-y-0 sm:space-x-4 sm:flex">
                      <span>{agent.phone}</span>
                      <span>{agent.email}</span>
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-2 sm:mt-0">
                    <div className="text-center">
                      <div className="text-lg font-bold">{agent.totalCalls}</div>
                      <div className="text-xs text-muted-foreground">Total Calls</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{agent.successfulCalls}</div>
                      <div className="text-xs text-muted-foreground">Successful</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {Math.round((agent.successfulCalls / agent.totalCalls) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Call Volume</CardTitle>
            <CardDescription>
              Total calls and lead generation performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {callTrackingMetrics.find((m: any) => m.name === "Total Calls")?.value || "0"}
                </div>
                <div className="text-sm text-muted-foreground">Total Calls</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {callTrackingMetrics.find((m: any) => m.name === "Qualified Leads")?.value || "0"}
                </div>
                <div className="text-sm text-muted-foreground">Qualified Leads</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>
              How effectively calls convert to qualified leads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {callTrackingMetrics.find((m: any) => m.name === "Conversion Rate")?.value || "0"}%
              </div>
              <div className="text-sm text-muted-foreground mt-2">Conversion Rate</div>
              <div className="text-xs text-muted-foreground mt-1">
                Above industry average of 45%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}