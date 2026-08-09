import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-void">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 bg-grid-pattern bg-grid px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1400px] animate-rise">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
