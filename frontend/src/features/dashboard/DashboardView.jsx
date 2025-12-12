import { useEffect, useState } from "react";
import { dripStore } from "../../store/dripStore";
import { DashboardCharts } from "./DashboardCharts";
import { DashboardMap } from "./DashboardMap";
import { cn } from "../../lib/utils";
import { Droplets, AlertTriangle, Users, Activity } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="p-6 glass-panel rounded-xl border shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]">
    <div>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="text-3xl font-bold mt-2 font-heading">{value}</div>
    </div>
    <div className={cn("p-3 rounded-full opacity-80", colorClass)}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

export function DashboardView() {
  const [stats, setStats] = useState({
    totalVillages: 0,
    waterFailure: 0,
    highRiskLivestock: 0,
    activeNGOs: 0,
  });

  useEffect(() => {
    const updateStats = () => {
      const state = dripStore.getState();
      const villages = state.villages;
      const alerts = state.alerts;
      const activities = state.ngoActivities;
      const livestock = state.livestock;

      // Calculations
      const failureCount = alerts.filter(
        (a) => a.type === "water" && !a.isResolved
      ).length;
      const riskLivestockCount = livestock.filter(
        (l) => l.mortalityRate > 30
      ).length;

      setStats({
        totalVillages: villages.length,
        waterFailure: failureCount,
        highRiskLivestock: riskLivestockCount,
        activeNGOs: activities.filter((a) => a.status === "ongoing").length,
      });
    };

    updateStats();
    dripStore.addEventListener("change", updateStats);
    return () => dripStore.removeEventListener("change", updateStats);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-cyan-500">
            Drought Intelligence Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring and coordination metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-background border rounded-md px-3 py-2 text-sm focus:ring-2 ring-primary">
            <option>All Regions</option>
            <option>Gedo</option>
            <option>Lower Juba</option>
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Villages Tracked"
          value={stats.totalVillages}
          icon={Users}
          colorClass="bg-blue-500"
        />
        <StatCard
          title="Water Criticial Alerts"
          value={stats.waterFailure}
          icon={Droplets}
          colorClass="bg-red-500"
        />
        <StatCard
          title="High Risk Livestock"
          value={stats.highRiskLivestock}
          icon={AlertTriangle}
          colorClass="bg-amber-500"
        />
        <StatCard
          title="Active NGO Interventions"
          value={stats.activeNGOs}
          icon={Activity}
          colorClass="bg-emerald-500"
        />
      </div>

      {/* Map Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Geospatial Coverage</h2>
        <DashboardMap />
      </div>

      {/* Charts Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Analytics & Trends</h2>
        <DashboardCharts />
      </div>
    </div>
  );
}
