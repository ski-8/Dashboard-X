import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, TrendingDown, Phone, BarChart3 } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import type { Metric } from "@shared/schema";

interface KPICardsProps {
  metrics: Metric[];
}

interface KPIData {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<any>;
  color: string;
  progress: number;
}

export default function KPICards({ metrics }: KPICardsProps) {
  // Process metrics to extract KPI data
  const getMetricValue = (type: string, source?: string) => {
    const metric = metrics.find(m => 
      m.metricType === type && (!source || m.source === source)
    );
    return metric?.value || 0;
  };

  const kpiData: KPIData[] = [
    {
      title: "Website Visitors",
      value: getMetricValue("visitors", "google_analytics").toLocaleString() || "12,847",
      change: 12.5,
      icon: Users,
      color: "blue",
      progress: 75,
    },
    {
      title: "LinkedIn Reach",
      value: getMetricValue("reach", "linkedin").toLocaleString() || "8,432",
      change: 8.2,
      icon: FaLinkedin,
      color: "blue",
      progress: 65,
    },
    {
      title: "Qualified Calls",
      value: getMetricValue("qualified_calls", "calls").toString() || "47",
      change: 23,
      icon: Phone,
      color: "green",
      progress: 85,
    },
    {
      title: "Conversion Rate",
      value: (getMetricValue("conversion_rate", "google_analytics") * 100).toFixed(1) + "%" || "3.7%",
      change: -2.1,
      icon: BarChart3,
      color: "purple",
      progress: 37,
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-100 dark:bg-blue-900",
        text: "text-blue-600 dark:text-blue-400",
        progress: "bg-blue-600",
      },
      green: {
        bg: "bg-green-100 dark:bg-green-900",
        text: "text-green-600 dark:text-green-400",
        progress: "bg-green-600",
      },
      purple: {
        bg: "bg-purple-100 dark:bg-purple-900",
        text: "text-purple-600 dark:text-purple-400",
        progress: "bg-purple-600",
      },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        const colors = getColorClasses(kpi.color);
        const isPositive = kpi.change > 0;

        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`${colors.text} w-5 h-5`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {isPositive ? '+' : ''}{kpi.change}%
                  </span>
                </div>
              </div>
              <Progress value={kpi.progress} className="h-2" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
