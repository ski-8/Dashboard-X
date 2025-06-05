import { useState } from "react";
import { Bell, Menu, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState("last-7-days");
  const [lastUpdated] = useState("2 min ago");

  const handleNotificationClick = () => {
    // In a real implementation, this would show notifications
    console.log("Show notifications");
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Performance Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.firstName || "there"}! Here's your latest metrics.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Filter Controls */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-muted-foreground hidden sm:block">Period:</label>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="last-7-days">Last 7 days</SelectItem>
                <SelectItem value="last-30-days">Last 30 days</SelectItem>
                <SelectItem value="month-to-date">Month to date</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Last Updated */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNotificationClick}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-2 h-2 p-0 rounded-full"
            />
          </Button>
        </div>
      </div>
    </header>
  );
}
