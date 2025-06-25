
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  BarChart3, 
  Waves, 
  MapPin, 
  TrendingUp, 
  Settings as SettingsIcon,
  Leaf
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Sensor Nodes",
    url: "/sensors",
    icon: Waves,
  },
  {
    title: "Cattle Tracker",
    url: "/cattle",
    icon: MapPin,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: TrendingUp,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: SettingsIcon,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="bg-white border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-farm-dark-green rounded-full flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-farm-dark-green">NCAIR</h2>
            <p className="text-xs text-gray-600 uppercase tracking-wide">Smart Farm</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  className={`w-full transition-all duration-200 ${
                    isActive 
                      ? 'bg-farm-dark-green text-white rounded-full shadow-lg' 
                      : 'text-gray-700 hover:bg-farm-light-green hover:text-farm-dark-green rounded-lg'
                  }`}
                >
                  <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
