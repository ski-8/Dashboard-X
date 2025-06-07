import { 
  BarChart3, 
  TrendingUp, 
  Phone, 
  FileText, 
  Folder, 
  MessageSquare, 
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
import { useState } from "react";
import type { Client } from "@shared/schema";

interface SidebarProps {
  client?: Client;
}

export default function Sidebar({ client }: SidebarProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="text-sidebar-primary-foreground h-4 w-4 lg:h-5 lg:w-5" />
          </div>
          <div>
            <h1 className="text-base lg:text-lg font-semibold text-sidebar-foreground">
              {client?.name || "Client Portal"}
            </h1>
            <p className="text-xs text-sidebar-foreground/60">Performance Dashboard</p>
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
                      ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
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
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-sidebar border-b border-sidebar-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="text-sidebar-primary-foreground h-4 w-4" />
          </div>
          <h1 className="text-base font-semibold text-sidebar-foreground">
            {client?.name || "Client Portal"}
          </h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-sidebar-foreground"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <nav className="bg-sidebar w-64 min-h-screen shadow-sm border-r border-sidebar-border" onClick={(e) => e.stopPropagation()}>
            <SidebarContent />
            
            {/* Mobile User Profile Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.profileImageUrl} alt={user?.displayName || "User"} />
                  <AvatarFallback>
                    {user?.displayName?.[0] || user?.username?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user?.displayName || user?.username || "User"}
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
        </div>
      )}

      {/* Desktop Sidebar */}
      <nav className="bg-sidebar w-64 min-h-screen shadow-sm border-r border-sidebar-border hidden lg:block">
        <SidebarContent />
        
        {/* Desktop User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-sidebar-border">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profileImageUrl} alt={user?.displayName || "User"} />
              <AvatarFallback>
                {user?.displayName?.[0] || user?.username?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.displayName || user?.username || "User"}
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
    </>
  );
}
