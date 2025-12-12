import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { dripStore } from "../../store/dripStore";
import {
  ArrowLeft,
  Droplets,
  Beef,
  HandHeart,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { ComingSoon } from "../../components/ComingSoon"; // For unimplemented map deep-dive

export function VillageProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      const village = dripStore.getVillageById(id);
      if (!village) return;

      const waterPoints = dripStore.getWaterPointsByVillage(id);
      const livestock = dripStore.getLivestockByVillage(id);
      const activities = dripStore
        .getNGOActivities()
        .filter((a) => a.villageId === id);

      setData({ village, waterPoints, livestock, activities });
    };

    fetchData();
    dripStore.addEventListener("change", fetchData);
    return () => dripStore.removeEventListener("change", fetchData);
  }, [id]);

  if (!data) return <div className="p-8">Loading or not found...</div>;
  const { village, waterPoints, livestock, activities } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/villages")}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold font-heading">{village.name}</h1>
          <p className="text-muted-foreground">
            {village.district} District • {village.region}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium border",
              village.isCovered
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-600"
                : "bg-red-500/10 border-red-500 text-red-600"
            )}
          >
            {village.isCovered ? "Covered" : "Not Covered"}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Stats Panel */}
        <div className="md:col-span-2 space-y-6">
          {/* Water Access Card */}
          <div className="glass-panel p-6 rounded-xl border relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Droplets className="w-24 h-24" />
            </div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" /> Water
              Infrastructure
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-card/50 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase">
                  Average Distance
                </p>
                <p className="text-2xl font-bold">
                  {village.distanceToWaterKm} km
                </p>
              </div>
              <div className="bg-card/50 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase">
                  Access Level
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    village.waterAccessLevel === "Critical"
                      ? "text-red-500"
                      : village.waterAccessLevel === "Low"
                      ? "text-amber-500"
                      : "text-emerald-500"
                  )}
                >
                  {village.waterAccessLevel}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Water Points</h3>
              <div className="space-y-2">
                {waterPoints.map((wp) => (
                  <div
                    key={wp.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm border"
                  >
                    <span className="capitalize font-medium">{wp.type}</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs",
                        wp.isFunctional
                          ? "bg-emerald-500/20 text-emerald-700"
                          : "bg-red-500/20 text-red-700"
                      )}
                    >
                      {wp.isFunctional ? "Functional" : "Non-Functional"}
                    </span>
                  </div>
                ))}
                {waterPoints.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No water points recorded.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Livestock Impact Card */}
          <div className="glass-panel p-6 rounded-xl border relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Beef className="w-24 h-24" />
            </div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Beef className="w-5 h-5 text-amber-600" /> Livestock Impact
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left">Species</th>
                    <th className="p-3 text-left">Total Count</th>
                    <th className="p-3 text-left">Mortality Rate</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {livestock.map((ls) => (
                    <tr key={ls.id} className="border-b last:border-0">
                      <td className="p-3">{ls.species}</td>
                      <td className="p-3">{ls.totalCount.toLocaleString()}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-muted rounded-full">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                ls.mortalityRate > 30
                                  ? "bg-red-500"
                                  : "bg-emerald-500"
                              )}
                              style={{
                                width: `${Math.min(ls.mortalityRate, 100)}%`,
                              }}
                            />
                          </div>
                          {ls.mortalityRate}%
                        </div>
                      </td>
                      <td className="p-3">
                        {ls.mortalityRate > 30 && (
                          <span className="flex items-center gap-1 text-red-600 text-xs font-bold">
                            <AlertTriangle className="w-3 h-3" /> CRITICAL
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {livestock.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-4 text-center text-muted-foreground"
                      >
                        No livestock data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Drought Timeline (Mock) */}
          <div className="glass-panel p-6 rounded-xl border">
            <h2 className="text-xl font-semibold mb-4">
              Drought Status Timeline (Last 30 Days)
            </h2>
            <div className="flex gap-1 overflow-x-auto py-2">
              {[...Array(30)].map((_, i) => {
                // Deterministic mock status based on village id and index
                const seed = village.id.charCodeAt(0) + i;
                const isBad = seed % 100 < village.vulnerabilityScore;
                return (
                  <div
                    key={i}
                    title={`Day ${i + 1}`}
                    className={cn(
                      "h-8 w-2 rounded-sm shrink-0",
                      isBad ? "bg-red-500/50" : "bg-emerald-500/50"
                    )}
                  />
                );
              })}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500/50 rounded-sm" />{" "}
                Sufficient Water
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500/50 rounded-sm" /> Critical
                Shortage
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl border">
            <h3 className="font-semibold mb-4">Demographics</h3>
            <div className="space-y-4">
              <div className="flex justify-between pb-2 border-b">
                <span className="text-muted-foreground">Population</span>
                <span className="font-medium">
                  {village.population.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-muted-foreground">Households (est.)</span>
                <span className="font-medium">
                  {(village.population / 6).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-muted-foreground">
                  Vulnerability Score
                </span>
                <span
                  className={cn(
                    "font-bold",
                    village.vulnerabilityScore > 70
                      ? "text-red-600"
                      : "text-blue-600"
                  )}
                >
                  {village.vulnerabilityScore}/100
                </span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <HandHeart className="w-4 h-4" /> Active Interventions
            </h3>
            <div className="space-y-4">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 bg-card border rounded-lg text-sm"
                >
                  <p className="font-bold text-primary">{act.activityType}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {act.ngoName} • {act.sector}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full text-xs capitalize">
                      {act.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Until{" "}
                      {new Date(act.endDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No active NGO interventions.
                </p>
              )}
            </div>
            <button className="w-full mt-4 py-2 text-sm border border-dashed rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              + Request Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
