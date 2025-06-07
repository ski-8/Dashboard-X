import { 
  BarChart3, 
  TrendingUp, 
  Phone, 
  FileText, 
  Folder, 
  Settings,
  Home
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import type { Client } from "@shared/schema";

interface SidebarProps {
  client?: Client;
}

export default function Sidebar({ client }: SidebarProps) {
  const { user } = useAuth();
  const [location] = useLocation();

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

  return (
    <nav className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200 hidden lg:block">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {client?.name || "Client Portal"}
            </h1>
            <p className="text-xs text-gray-500">Performance Dashboard</p>
          </div>
        </div>
      </div>
      
      <div className="px-6">
        <nav className="space-y-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={index} href={item.href}>
                <button
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback>
              {user?.displayName?.[0] || user?.username?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.displayName || user?.username || "User"}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role || "Client"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
