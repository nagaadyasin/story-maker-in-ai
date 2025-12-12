import { useAuth } from "../features/auth/AuthContext";
import { ModeToggle } from "./mode-toggle";
import { Bell, Search, LogOut } from "lucide-react";
import { dripStore } from "../store/dripStore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeAlerts, setActiveAlerts] = useState(
    () => dripStore.getActiveAlerts().length
  );

  useEffect(() => {
    // Subscribe to store changes to update alert count
    const handleStoreChange = () => {
      setActiveAlerts(dripStore.getActiveAlerts().length);
    };

    dripStore.addEventListener("change", handleStoreChange);
    return () => {
      dripStore.removeEventListener("change", handleStoreChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 border-b bg-background/50 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        {/* Search Bar (Mock) */}
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search villages, NGOs, water points..."
            className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Alerts Badge */}
        <button
          className="relative p-2 hover:bg-accent rounded-full transition-colors"
          onClick={() => navigate("/alerts")}
        >
          <Bell className="h-5 w-5" />
          {activeAlerts > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </button>

        {/* Theme Toggle */}
        <ModeToggle />

        {/* User Actions */}
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">{user?.username}</p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            title="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
