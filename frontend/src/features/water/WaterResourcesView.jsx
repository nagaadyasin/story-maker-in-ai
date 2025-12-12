import { useState, useEffect, useMemo } from "react";
import { dripStore } from "../../store/dripStore";
import {
  Droplets,
  Wrench,
  AlertCircle,
  CheckCircle,
  Calculator,
} from "lucide-react";
import { cn } from "../../lib/utils";

export function WaterResourcesView() {
  const [waterPoints, setWaterPoints] = useState(() =>
    dripStore.getWaterPoints()
  );
  const [villages, setVillages] = useState(() => dripStore.getVillages());
  const [calculator, setCalculator] = useState({
    population: 5000,
    capacity: 500,
  });

  useEffect(() => {
    const handleUpdate = () => {
      setWaterPoints(dripStore.getWaterPoints());
      setVillages(dripStore.getVillages());
    };
    dripStore.addEventListener("change", handleUpdate);
    return () => dripStore.removeEventListener("change", handleUpdate);
  }, []);

  const resultDays = useMemo(() => {
    // 15L per person per day. Capacity is in m3 (1m3 = 1000L).
    // Days = (Capacity * 1000) / (Population * 15)
    if (calculator.population <= 0) return 0;
    const days = (calculator.capacity * 1000) / (calculator.population * 15);
    return Math.floor(days);
  }, [calculator.population, calculator.capacity]);

  const handleStatusToggle = (id, currentFunctional) => {
    // Toggle status
    const newStatus = !currentFunctional ? "functional" : "damaged";
    dripStore.updateWaterPointStatus(id, newStatus, !currentFunctional);
  };

  const getVillageName = (id) =>
    villages.find((v) => (v._id || v.id) === id)?.name || "Unknown";

  const functionalCount = waterPoints.filter((wp) => wp.isFunctional).length;
  const criticalCount = waterPoints.filter((wp) => !wp.isFunctional).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-cyan-600 to-blue-500">
            Water Infrastructure
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor borehole status and estimate resource longevity.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Stats & Calculator Panel */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="glass-panel p-6 rounded-xl border space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Droplets className="w-4 h-4" /> Infrastructure Health
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {functionalCount}
                </p>
                <p className="text-xs text-muted-foreground uppercase">
                  Functional
                </p>
              </div>
              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 text-center">
                <p className="text-2xl font-bold text-red-600">
                  {criticalCount}
                </p>
                <p className="text-xs text-muted-foreground uppercase">
                  Critical
                </p>
              </div>
            </div>
          </div>

          {/* Survival Calculator */}
          <div className="glass-panel p-6 rounded-xl border">
            <h3 className="font-semibold flex items-center gap-2 mb-4 text-primary">
              <Calculator className="w-4 h-4" /> Water Survival Calculator
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Population
                </label>
                <input
                  type="number"
                  className="w-full bg-background border rounded px-3 py-2 text-sm"
                  value={calculator.population}
                  onChange={(e) =>
                    setCalculator({
                      ...calculator,
                      population: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Water Capacity (m³)
                </label>
                <input
                  type="number"
                  className="w-full bg-background border rounded px-3 py-2 text-sm"
                  value={calculator.capacity}
                  onChange={(e) =>
                    setCalculator({
                      ...calculator,
                      capacity: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="pt-2 border-t mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Estimated Duration:
                  </span>
                  <span
                    className={cn(
                      "text-xl font-bold",
                      resultDays < 7 ? "text-red-500" : "text-emerald-500"
                    )}
                  >
                    {resultDays} Days
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 text-right">
                  Based on Sphere Standards (15L/day/person)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Water Points List */}
        <div className="md:col-span-2 glass-panel rounded-xl border overflow-hidden">
          <div className="p-4 border-b bg-muted/50">
            <h3 className="font-semibold">Water Points Registry</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-4 font-medium text-muted-foreground">
                    Point ID
                  </th>
                  <th className="p-4 font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="p-4 font-medium text-muted-foreground">
                    Village
                  </th>
                  <th className="p-4 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="p-4 font-medium text-muted-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {waterPoints.map((wp) => (
                  <tr
                    key={wp._id || wp.id}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="p-4 font-mono text-xs text-muted-foreground">
                      {(wp._id || wp.id).substring(0, 6)}...
                    </td>
                    <td className="p-4 capitalize font-medium">{wp.type}</td>
                    <td className="p-4">{getVillageName(wp.villageId)}</td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium flex w-fit items-center gap-1",
                          wp.isFunctional
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-red-500/10 text-red-600"
                        )}
                      >
                        {wp.isFunctional ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {wp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() =>
                          handleStatusToggle(wp._id || wp.id, wp.isFunctional)
                        }
                        className={cn(
                          "inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
                          wp.isFunctional
                            ? "border-red-200 text-red-600 hover:bg-red-50"
                            : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        )}
                      >
                        <Wrench className="w-3 h-3" />
                        {wp.isFunctional ? "Report Breakdown" : "Mark Repaired"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
