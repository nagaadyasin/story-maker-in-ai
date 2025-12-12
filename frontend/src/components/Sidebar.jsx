import { NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { cn } from "../lib/utils";
import {
  LayoutDashboard,
  Map,
  Droplets,
  Beef,
  HandHeart,
  AlertTriangle,
  Settings,
  Menu,
} from "lucide-react";
import { useState } from "react";

const NavItem = ({ to, label, icon: Icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )
    }
  >
    <Icon className="w-5 h-5" />
    {label}
  </NavLink>
);

export function Sidebar() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Based on "Role-Based UI":
  // Government: All
  // NGO: Dashboard, Villages, NGO Activities, Coverage.
  // District Officer: Dashboard, Villages, Alerts, Water, Livestock.

  const allLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["GOVERNMENT", "NGO", "DISTRICT_OFFICER"],
    },
    {
      to: "/villages",
      label: "Villages",
      icon: Map,
      roles: ["GOVERNMENT", "NGO", "DISTRICT_OFFICER"],
    },
    {
      to: "/water",
      label: "Water Resources",
      icon: Droplets,
      roles: ["GOVERNMENT", "DISTRICT_OFFICER"],
    },
    {
      to: "/livestock",
      label: "Livestock",
      icon: Beef,
      roles: ["GOVERNMENT", "DISTRICT_OFFICER"],
    },
    {
      to: "/ngos",
      label: "NGO Activities",
      icon: HandHeart,
      roles: ["GOVERNMENT", "NGO"],
    },
    {
      to: "/coverage",
      label: "Coverage Map",
      icon: Map,
      roles: ["GOVERNMENT", "NGO"],
    },
    {
      to: "/alerts",
      label: "Alerts",
      icon: AlertTriangle,
      roles: ["GOVERNMENT", "DISTRICT_OFFICER"],
    },
    {
      to: "/settings",
      label: "Settings",
      icon: Settings,
      roles: ["GOVERNMENT", "NGO", "DISTRICT_OFFICER"],
    },
  ];

  const visibleLinks = allLinks.filter(
    (link) => !user || link.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile Trigger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-background border rounded-md shadow-sm"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background/80 backdrop-blur-xl border-r transform transition-transform duration-200 md:translate-x-0",
          !isMobileMenuOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full bg-card/50">
          <div className="h-16 flex items-center px-6 border-b">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-cyan-500">
              DRIP Manager
            </span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {visibleLinks.map((link) => (
              <NavItem
                key={link.to}
                {...link}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ))}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.role?.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
