import { 
  BarChart3, 
  TrendingUp, 
  Phone, 
  FileText, 
  Folder, 
  MessageSquare, 
  Settings,
  Home
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { Client } from "@shared/schema";

interface SidebarProps {
  client?: Client;
}

export default function Sidebar({ client }: SidebarProps) {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const navigationItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: TrendingUp, label: "Analytics" },
    { icon: FaLinkedin, label: "LinkedIn" },
    { icon: Phone, label: "Call Tracking" },
    { icon: FileText, label: "Reports" },
    { icon: Folder, label: "Files" },
    { icon: MessageSquare, label: "Comments" },
  ];

  return (
    <nav className="bg-sidebar w-64 min-h-screen shadow-sm border-r border-sidebar-border hidden lg:block">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="text-sidebar-primary-foreground h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">
              {client?.brandName || client?.name || "Client Portal"}
            </h1>
            <p className="text-xs text-sidebar-foreground/60">Performance Dashboard</p>
          </div>
        </div>
      </div>
      
      <div className="px-6">
        <nav className="space-y-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  item.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className={item.active ? "font-medium" : ""}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
            <AvatarFallback>
              {user?.firstName?.[0] || user?.email?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.email || "User"
              }
            </p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">
              {user?.role || "Client"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground p-1"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
