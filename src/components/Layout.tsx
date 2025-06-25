
import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-farm-medium-green hover:text-farm-bright-green" />
          <h1 className="text-2xl font-bold text-farm-dark-green">NCAIR Smart Farm</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-farm-accent-green rounded-full animate-pulse-green"></div>
          <span className="text-sm text-gray-600">System Online</span>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
