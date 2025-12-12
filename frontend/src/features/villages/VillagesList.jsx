import { useState, useEffect } from "react";
import { dripStore } from "../../store/dripStore";
import { useNavigate } from "react-router-dom";
import { Search, Filter, AlertTriangle, MapPin } from "lucide-react";
import { cn } from "../../lib/utils";

export function VillagesList() {
  const navigate = useNavigate();
  const [villages, setVillages] = useState(() => dripStore.getVillages());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, critical, no-ngo

  useEffect(() => {
    const handleUpdate = () => setVillages(dripStore.getVillages());
    dripStore.addEventListener("change", handleUpdate);
    return () => dripStore.removeEventListener("change", handleUpdate);
  }, []);

  const filteredVillages = villages.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.district.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "critical") return v.vulnerabilityScore > 70;
    if (filter === "no-ngo") return !v.isCovered;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-cyan-500">
            Villages Registry
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage village profiles and vulnerability assessments.
          </p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          + Add Village
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or district..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-2 rounded-lg text-sm border transition-colors",
              filter === "all"
                ? "bg-primary/10 border-primary text-primary"
                : "bg-card hover:bg-muted"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("critical")}
            className={cn(
              "px-3 py-2 rounded-lg text-sm border transition-colors flex items-center gap-2",
              filter === "critical"
                ? "bg-red-500/10 border-red-500 text-red-600"
                : "bg-card hover:bg-muted"
            )}
          >
            <AlertTriangle className="w-3 h-3" />
            High Risk
          </button>
          <button
            onClick={() => setFilter("no-ngo")}
            className={cn(
              "px-3 py-2 rounded-lg text-sm border transition-colors",
              filter === "no-ngo"
                ? "bg-amber-500/10 border-amber-500 text-amber-600"
                : "bg-card hover:bg-muted"
            )}
          >
            No Coverage
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="p-4 font-medium text-muted-foreground">
                  Village Name
                </th>
                <th className="p-4 font-medium text-muted-foreground">
                  District
                </th>
                <th className="p-4 font-medium text-muted-foreground">
                  Water Access
                </th>
                <th className="p-4 font-medium text-muted-foreground">
                  Vulnerability
                </th>
                <th className="p-4 font-medium text-muted-foreground">
                  Coverage
                </th>
                <th className="p-4 font-medium text-muted-foreground">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredVillages.map((village) => (
                <tr
                  key={village._id || village.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-medium">
                    <button
                      onClick={() =>
                        navigate(`/villages/${village._id || village.id}`)
                      }
                      className="hover:underline hover:text-primary text-left"
                    >
                      {village.name}
                    </button>
                  </td>
                  <td className="p-4">{village.district}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        village.waterAccessLevel === "Critical"
                          ? "bg-red-500/20 text-red-600"
                          : village.waterAccessLevel === "Low"
                          ? "bg-amber-500/20 text-amber-600"
                          : "bg-emerald-500/20 text-emerald-600"
                      )}
                    >
                      {village.waterAccessLevel}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            village.vulnerabilityScore > 70
                              ? "bg-red-500"
                              : "bg-blue-500"
                          )}
                          style={{ width: `${village.vulnerabilityScore}%` }}
                        />
                      </div>
                      <span className="text-xs">
                        {village.vulnerabilityScore}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    {village.isCovered ? (
                      <span className="text-emerald-600 text-xs font-medium">
                        Active NGO
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">
                        No Activity
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground text-xs">
                    {new Date(village.lastUpdated).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filteredVillages.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No villages found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
