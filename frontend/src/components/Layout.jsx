import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Layout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased flex">
      <Sidebar />

      <main className="flex-1 flex flex-col min-h-screen md:pl-64 transition-all duration-200">
        <Topbar />
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
