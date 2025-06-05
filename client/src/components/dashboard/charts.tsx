import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import type { Metric } from "@shared/schema";

interface ChartsProps {
  metrics: Metric[];
}

export default function Charts({ metrics }: ChartsProps) {
  // Process metrics for website analytics chart
  const websiteData = [
    { month: "Jan", sessions: 2400, conversions: 89 },
    { month: "Feb", sessions: 2800, conversions: 112 },
    { month: "Mar", sessions: 3200, conversions: 128 },
    { month: "Apr", sessions: 2900, conversions: 105 },
    { month: "May", sessions: 3400, conversions: 137 },
    { month: "Jun", sessions: 3800, conversions: 152 },
    { month: "Jul", sessions: 4200, conversions: 168 },
  ];

  // Process metrics for LinkedIn pie chart
  const linkedinData = [
    { name: "Organic Reach", value: 45, color: "#0077b5" },
    { name: "Paid Reach", value: 35, color: "#00a0dc" },
    { name: "Engagement", value: 20, color: "#40e0d0" },
  ];

  const handleViewDetails = () => {
    // In a real implementation, this would navigate to detailed LinkedIn analytics
    console.log("Navigate to LinkedIn details");
  };

  return (
    <>
      {/* Website Analytics Chart */}
      <Card className="animate-slide-up">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Website Performance</CardTitle>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-muted-foreground">Sessions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-muted-foreground">Conversions</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={websiteData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Line 
                type="monotone" 
                dataKey="sessions" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="conversions" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* LinkedIn Performance Chart */}
      <Card className="animate-slide-up">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">LinkedIn Performance</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleViewDetails}>
              View Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={linkedinData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {linkedinData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
