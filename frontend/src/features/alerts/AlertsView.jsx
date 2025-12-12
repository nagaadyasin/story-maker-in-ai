import { useState, useEffect } from "react";
import { dripStore } from "../../store/dripStore";
import { AlertTriangle, CheckCircle, BellRing, Filter } from "lucide-react";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

export function AlertsView() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(() => dripStore.getAlerts());
  const [filter, setFilter] = useState("unresolved"); // unresolved, all

  useEffect(() => {
    const handleUpdate = () => setAlerts(dripStore.getAlerts());
    dripStore.addEventListener("change", handleUpdate);
    return () => dripStore.removeEventListener("change", handleUpdate);
  }, []);

  const [villages] = useState(() => dripStore.getVillages()); // Just for name lookup

  const getVillageName = (id) =>
    villages.find((v) => (v._id || v.id) === id)?.name || "Unknown Location";

  const filteredAlerts = alerts
    .filter((a) => {
      if (filter === "unresolved") return !a.isResolved;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first

  const handleResolve = (id, e) => {
    e.stopPropagation();
    dripStore.resolveAlert(id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-red-600 to-orange-500">
            System Alerts
          </h1>
          <p className="text-muted-foreground mt-1">
            Critical notifications requiring immediate attention.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("unresolved")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm border font-medium transition-colors",
              filter === "unresolved"
                ? "bg-red-500/10 border-red-500 text-red-600"
                : "bg-card hover:bg-muted"
            )}
          >
            Active Issues
          </button>
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm border font-medium transition-colors",
              filter === "all"
                ? "bg-primary/10 border-primary text-primary"
                : "bg-card hover:bg-muted"
            )}
          >
            All History
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert._id || alert.id}
            onClick={() => navigate(`/villages/${alert.villageId}`)}
            className={cn(
              "p-6 rounded-xl border glass-panel transition-all hover:bg-muted/30 cursor-pointer group relative overflow-hidden",
              !alert.isResolved && alert.severity === "critical"
                ? "border-red-500/50 bg-red-500/5"
                : !alert.isResolved
                ? "border-amber-500/50 bg-amber-500/5"
                : "opacity-60"
            )}
          >
            {!alert.isResolved && (
              <div
                className={cn(
                  "absolute left-0 top-0 bottom-0 w-1",
                  alert.severity === "critical" ? "bg-red-500" : "bg-amber-500"
                )}
              />
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "p-2 rounded-full mt-1",
                    alert.severity === "critical"
                      ? "bg-red-500/10 text-red-600"
                      : "bg-amber-500/10 text-amber-600"
                  )}
                >
                  {alert.isResolved ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{alert.message}</h3>
                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {getVillageName(alert.villageId)}
                    </span>
                    •<span className="capitalize">{alert.type} Issue</span>•
                    <span>{new Date(alert.createdAt).toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!alert.isResolved ? (
                  <button
                    onClick={(e) => handleResolve(alert._id || alert.id, e)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm transition-colors"
                  >
                    MARK RESOLVED
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-bold rounded-full border border-emerald-500/20">
                    RESOLVED
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="p-12 text-center border rounded-xl border-dashed bg-muted/20">
            <div className="inline-flex p-4 rounded-full bg-muted mb-4">
              <BellRing className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No alerts found</h3>
            <p className="text-muted-foreground">
              Great job! All systems are running smoothly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
