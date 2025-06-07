import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Calendar, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Reports() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/demo-dashboard"],
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Reports</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    );
  }

  const reports = [
    {
      id: 1,
      title: "Monthly Analytics Report",
      description: "Comprehensive overview of Google Analytics, LinkedIn, and call tracking metrics",
      type: "Monthly",
      lastGenerated: "2024-01-15",
      status: "Available"
    },
    {
      id: 2,
      title: "Lead Generation Summary",
      description: "Call tracking performance and conversion analysis",
      type: "Weekly",
      lastGenerated: "2024-01-14",
      status: "Available"
    },
    {
      id: 3,
      title: "Social Media Performance",
      description: "LinkedIn engagement and reach metrics breakdown",
      type: "Bi-weekly",
      lastGenerated: "2024-01-12",
      status: "Available"
    },
    {
      id: 4,
      title: "Custom Performance Dashboard",
      description: "Tailored metrics report based on your KPIs",
      type: "On-demand",
      lastGenerated: "2024-01-10",
      status: "Generating"
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold">Reports</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button size="sm" variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
          <Button size="sm">
            Generate Custom Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Reports
                </p>
                <p className="text-xl sm:text-2xl font-bold">24</p>
              </div>
              <div className="bg-indigo-50 p-2 rounded-lg">
                <FileText className="h-4 w-4 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  This Month
                </p>
                <p className="text-xl sm:text-2xl font-bold">8</p>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Scheduled
                </p>
                <p className="text-xl sm:text-2xl font-bold">5</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Downloads
                </p>
                <p className="text-xl sm:text-2xl font-bold">156</p>
              </div>
              <div className="bg-purple-50 p-2 rounded-lg">
                <Download className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Available Reports */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Available Reports</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <Badge 
                    variant={report.status === "Available" ? "default" : "secondary"}
                    className={report.status === "Available" ? "bg-green-100 text-green-800" : ""}
                  >
                    {report.status}
                  </Badge>
                </div>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Type: <span className="font-medium">{report.type}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last Generated: <span className="font-medium">{new Date(report.lastGenerated).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {report.status === "Available" && (
                      <>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </>
                    )}
                    {report.status === "Generating" && (
                      <Button size="sm" variant="outline" disabled>
                        Generating...
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>
            Pre-configured report templates for quick generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <h4 className="font-semibold mb-2">Executive Summary</h4>
              <p className="text-sm text-muted-foreground mb-3">
                High-level overview for stakeholders
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Generate Report
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <h4 className="font-semibold mb-2">Detailed Analytics</h4>
              <p className="text-sm text-muted-foreground mb-3">
                In-depth metrics and performance analysis
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Generate Report
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <h4 className="font-semibold mb-2">Campaign ROI</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Return on investment and cost analysis
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}