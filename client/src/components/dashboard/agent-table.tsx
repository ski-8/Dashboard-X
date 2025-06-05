import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { CallAgent } from "@shared/schema";

interface AgentTableProps {
  agents: CallAgent[];
}

export default function AgentTable({ agents }: AgentTableProps) {
  const handleExportCSV = () => {
    // In a real implementation, this would export the data as CSV
    console.log("Export agent data as CSV");
  };

  // If no agents data, show sample data for demo
  const displayAgents = agents.length > 0 ? agents : [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612a1a7?w=150&h=150&fit=crop&crop=face",
      totalCalls: 127,
      qualifiedCalls: 89,
      conversionRate: 70,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      totalCalls: 98,
      qualifiedCalls: 62,
      conversionRate: 63,
      rating: 4.6,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      totalCalls: 115,
      qualifiedCalls: 78,
      conversionRate: 68,
      rating: 4.7,
    },
  ];

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Call Agent Performance</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Agent</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Calls</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Qualified</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Conversion</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Rating</th>
              </tr>
            </thead>
            <tbody>
              {displayAgents.map((agent) => (
                <tr key={agent.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={agent.avatar} alt={agent.name} />
                        <AvatarFallback>
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground">{agent.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-muted-foreground">{agent.totalCalls}</td>
                  <td className="py-3 px-2 text-sm text-muted-foreground">{agent.qualifiedCalls}</td>
                  <td className="py-3 px-2">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {agent.conversionRate}%
                    </Badge>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{agent.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
