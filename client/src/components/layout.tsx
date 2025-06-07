import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3, 
  TrendingUp, 
  Phone, 
  FileText, 
  Folder, 
  Settings,
  Home,
  Menu,
  X
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: dashboardData } = useQuery({
    queryKey: ["/api/demo-dashboard"],
  });

  const client = dashboardData?.client;

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: TrendingUp, label: "Analytics", href: "/analytics" },
    { icon: FaLinkedin, label: "LinkedIn", href: "/linkedin" },
    { icon: Phone, label: "Call Tracking", href: "/call-tracking" },
    { icon: FileText, label: "Reports", href: "/reports" },
    { icon: Folder, label: "Files", href: "/files" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 lg:p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="text-white h-4 w-4 lg:h-5 lg:w-5" />
          </div>
          <div>
            <h1 className="text-base lg:text-lg font-semibold text-foreground">
              {client?.name || "Client Portal"}
            </h1>
            <p className="text-xs text-muted-foreground">Performance Dashboard</p>
          </div>
        </div>
      </div>
      
      <div className="px-4 lg:px-6 flex-1">
        <nav className="space-y-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={index} href={item.href}>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className={isActive ? "font-medium" : ""}>{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 lg:p-6 border-t border-border">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
            <AvatarFallback>
              {user?.displayName?.[0] || user?.username?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.displayName || user?.username || "User"}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role || "Client"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <div className="lg:hidden bg-white border-b border-border p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="text-white h-4 w-4" />
          </div>
          <h1 className="text-base font-semibold text-foreground">
            {client?.name || "Client Portal"}
          </h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-foreground"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <nav className="bg-white w-64 min-h-screen shadow-sm border-r border-border" onClick={(e) => e.stopPropagation()}>
            <SidebarContent />
          </nav>
        </div>
      )}

      <nav className="bg-white w-64 min-h-screen shadow-sm border-r border-border hidden lg:block fixed left-0 top-0">
        <SidebarContent />
      </nav>

      <div className="flex-1 lg:ml-64">
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}