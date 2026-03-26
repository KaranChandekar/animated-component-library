"use client";

import { useState } from "react";
import Header from "./Header";
import NavigationSidebar from "./NavigationSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Header onMenuToggle={toggleSidebar} />
      <NavigationSidebar open={sidebarOpen} onClose={closeSidebar} />

      <main
        className="pt-16 md:pl-[280px]"
        style={
          {
            "--sidebar-width": "280px",
            "--header-height": "64px",
          } as React.CSSProperties
        }
      >
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
