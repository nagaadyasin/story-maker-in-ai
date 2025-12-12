import { useState, useEffect } from "react";
import { dripStore } from "../../store/dripStore";
import { HandHeart, Plus, MapPin, Search } from "lucide-react";
import { DashboardMap } from "../dashboard/DashboardMap"; // Reuse map for coverage visualization

export function NGOActivitiesView() {
  const [activities, setActivities] = useState(() =>
    dripStore.getNGOActivities()
  );
  const [villages, setVillages] = useState(() => dripStore.getVillages());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    ngoName: "",
    activityType: "Water Trucking",
    villageId: "",
    sector: "WASH",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const handleUpdate = () => {
      setActivities(dripStore.getNGOActivities());
      setVillages(dripStore.getVillages());
    };
    dripStore.addEventListener("change", handleUpdate);
    return () => dripStore.removeEventListener("change", handleUpdate);
  }, []);

  const getVillageName = (id) =>
    villages.find((v) => (v._id || v.id) === id)?.name || "Unknown";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newActivity.ngoName || !newActivity.villageId) return; // Basic validation

    await dripStore.addNGOActivity({
      ...newActivity,
      status: "ongoing",
      coordinates: [0, 0], // Mock coordinates, in real app would verify from village
    });
    setIsFormOpen(false);
    setNewActivity({
      ngoName: "",
      activityType: "Water Trucking",
      villageId: "",
      sector: "WASH",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-500">
            NGO Coordination
          </h1>
          <p className="text-muted-foreground mt-1">
            Track partner interventions and identifying coverage gaps.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Log Activity
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activities List */}
        <div className="lg:col-span-2 glass-panel rounded-xl border overflow-hidden">
          <div className="p-4 border-b bg-muted/50 flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2">
              <HandHeart className="w-4 h-4 text-primary" /> Active
              Interventions
            </h3>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter..."
                className="w-full h-8 pl-8 rounded-md border bg-background text-xs"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground bg-muted/20">
                  <th className="p-4">Organization</th>
                  <th className="p-4">Activity</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Sector</th>
                  <th className="p-4">Timeline</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((act) => (
                  <tr
                    key={act._id || act.id}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="p-4 font-medium">{act.ngoName}</td>
                    <td className="p-4">{act.activityType}</td>
                    <td className="p-4 text-muted-foreground">
                      {getVillageName(act.villageId)}
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-500/10 text-blue-600 px-2 py-1 rounded text-xs">
                        {act.sector}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(act.startDate).toLocaleDateString(undefined, {
                        month: "short",
                      })}{" "}
                      -{" "}
                      {new Date(act.endDate).toLocaleDateString(undefined, {
                        month: "short",
                        year: "2-digit",
                      })}
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Ongoing
                      </span>
                    </td>
                  </tr>
                ))}
                {activities.length === 0 && (
                  <tr className="text-center text-muted-foreground">
                    <td colSpan={6} className="p-8">
                      No activities logged.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coverage Map (Mini) */}
        <div className="space-y-6">
          <div className="glass-panel p-1 rounded-xl border h-64 overflow-hidden relative">
            <div className="absolute top-2 left-2 z-50 bg-background/80 backdrop-blur px-2 py-1 rounded text-xs font-bold border">
              Coverage Heatmap
            </div>
            <DashboardMap />
          </div>

          <div className="glass-panel p-6 rounded-xl border">
            <h3 className="font-semibold mb-4">Sector Breakdown</h3>
            <div className="space-y-3">
              {["WASH", "Food Security", "Health", "Shelter", "Cash"].map(
                (sector) => {
                  const count = activities.filter(
                    (a) => a.sector === sector
                  ).length;
                  const total = activities.length || 1;
                  const percent = (count / total) * 100;
                  return (
                    <div key={sector}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{sector}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Activity Modal (Simplified) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-background rounded-xl border shadow-xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <h2 className="text-xl font-bold">Log New Intervention</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Organization Name</label>
                <input
                  required
                  className="w-full border rounded-md px-3 py-2 bg-background"
                  value={newActivity.ngoName}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, ngoName: e.target.value })
                  }
                  placeholder="e.g. Red Cross"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Sector</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 bg-background"
                    value={newActivity.sector}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, sector: e.target.value })
                    }
                  >
                    <option>WASH</option>
                    <option>Food Security</option>
                    <option>Health</option>
                    <option>Cash</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Activity Type</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 bg-background"
                    value={newActivity.activityType}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        activityType: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Target Village</label>
                <select
                  required
                  className="w-full border rounded-md px-3 py-2 bg-background"
                  value={newActivity.villageId}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      villageId: e.target.value,
                    })
                  }
                >
                  <option value="">Select Village...</option>
                  {villages.map((v) => (
                    <option key={v._id || v.id} value={v._id || v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-md px-3 py-2 bg-background"
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-md px-3 py-2 bg-background"
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-sm hover:bg-muted rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md"
                >
                  Submit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
