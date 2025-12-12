import { useState, useEffect } from "react";
import { dripStore } from "../../store/dripStore";
import { Beef, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

export function LivestockView() {
  const navigate = useNavigate();
  const [livestock, setLivestock] = useState(
    () => dripStore.getState().livestock
  );
  const [villages, setVillages] = useState(() => dripStore.getVillages());

  useEffect(() => {
    const handleUpdate = () => {
      setLivestock(dripStore.getState().livestock);
      setVillages(dripStore.getVillages());
    };
    dripStore.addEventListener("change", handleUpdate);
    return () => dripStore.removeEventListener("change", handleUpdate);
  }, []);

  const getVillageName = (id) =>
    villages.find((v) => v.id === id)?.name || "Unknown";

  const totalHead = livestock.reduce((acc, curr) => acc + curr.totalCount, 0);
  const criticalHerds = livestock.filter((l) => l.mortalityRate > 30).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-amber-600 to-yellow-500">
          Livestock Health
        </h1>
        <p className="text-muted-foreground mt-1">
          Track mortality rates and herd conditions across regions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel p-6 rounded-xl border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Livestock Head
            </h3>
            <p className="text-3xl font-bold mt-2 text-amber-600">
              {totalHead.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-full">
            <Beef className="w-6 h-6 text-amber-600" />
          </div>
        </div>
        <div className="glass-panel p-6 rounded-xl border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Critical Mortality Alerts
            </h3>
            <p className="text-3xl font-bold mt-2 text-red-600">
              {criticalHerds}
            </p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="p-4 font-medium text-muted-foreground">
                  Village
                </th>
                <th className="p-4 font-medium text-muted-foreground">
                  Species
                </th>
                <th className="p-4 font-medium text-muted-foreground">
                  Total Count
                </th>
                <th className="p-4 font-medium text-muted-foreground">
                  Mortality Rate
                </th>
                <th className="p-4 font-medium text-muted-foreground">
                  Condition Trend
                </th>
                <th className="p-4 font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {livestock.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="p-4 font-medium">
                    <button
                      onClick={() => navigate(`/villages/${item.villageId}`)}
                      className="hover:underline hover:text-primary"
                    >
                      {getVillageName(item.villageId)}
                    </button>
                  </td>
                  <td className="p-4">{item.species}</td>
                  <td className="p-4">{item.totalCount.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            item.mortalityRate > 30
                              ? "bg-red-500 animate-pulse"
                              : "bg-emerald-500"
                          )}
                          style={{
                            width: `${Math.min(item.mortalityRate, 100)}%`,
                          }}
                        />
                      </div>
                      <span
                        className={cn(
                          "font-bold text-xs",
                          item.mortalityRate > 30
                            ? "text-red-600"
                            : "text-emerald-600"
                        )}
                      >
                        {item.mortalityRate}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    {item.mortalityRate > 20 ? (
                      <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
                        <TrendingDown className="w-3 h-3" /> Deteriorating
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
                        <TrendingUp className="w-3 h-3" /> Stable
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <button className="text-xs border px-2 py-1 rounded hover:bg-muted transition-colors">
                      Update Stats
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
