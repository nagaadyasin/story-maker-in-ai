import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { dripStore } from "../../store/dripStore";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function calculateChartData(state) {
  const villages = state.villages;
  const activities = state.ngoActivities;

  // Coverage Doughnut
  const covered = villages.filter((v) => v.isCovered).length;
  const notCovered = villages.length - covered;

  // Sector Bar Chart
  const sectors = {};
  activities.forEach((a) => {
    sectors[a.sector] = (sectors[a.sector] || 0) + 1;
  });

  // Mock Monthly Data for Line Chart
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const failures = [2, 4, 1, 5, 2, 3];
  const fixes = [1, 3, 2, 4, 3, 2];

  return {
    coverage: {
      labels: ["Covered", "Not Covered"],
      datasets: [
        {
          data: [covered, notCovered],
          backgroundColor: ["#10b981", "#ef4444"], // Emerald, Red
          borderColor: ["#059669", "#b91c1c"],
          borderWidth: 1,
        },
      ],
    },
    sectors: {
      labels: Object.keys(sectors),
      datasets: [
        {
          label: "Interventions by Sector",
          data: Object.values(sectors),
          backgroundColor: "rgba(59, 130, 246, 0.5)", // Blue
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 1,
        },
      ],
    },
    lineData: {
      labels: months,
      datasets: [
        {
          label: "Water Point Failures",
          data: failures,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.5)",
          tension: 0.4,
        },
        {
          label: "Repairs Completed",
          data: fixes,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.5)",
          tension: 0.4,
        },
      ],
    },
  };
}

export function DashboardCharts() {
  const [data, setData] = useState(() => {
    const state = dripStore.getState();
    return calculateChartData(state);
  });

  useEffect(() => {
    const handleUpdate = () => {
      const state = dripStore.getState();
      setData(calculateChartData(state));
    };
    dripStore.addEventListener("change", handleUpdate);
    return () => dripStore.removeEventListener("change", handleUpdate);
  }, []);

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "var(--color-foreground)" }, // Try to adapt to theme (basic)
      },
      title: { display: false },
    },
    scales: {
      x: { ticks: { color: "#888" }, grid: { color: "#33333333" } },
      y: { ticks: { color: "#888" }, grid: { color: "#33333333" } },
    },
  };

  const doughnutOptions = {
    ...commonOptions,
    scales: {}, // No scales for doughnut
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="glass-panel p-4 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">Intervention Trends</h3>
        <Line
          options={commonOptions}
          data={data.lineData || { datasets: [] }}
        />
      </div>

      <div className="glass-panel p-4 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">Village Coverage</h3>
        <div className="h-64 flex items-center justify-center">
          <Doughnut
            options={doughnutOptions}
            data={data.coverage || { datasets: [] }}
          />
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">Activities by Sector</h3>
        <Bar options={commonOptions} data={data.sectors || { datasets: [] }} />
      </div>
    </div>
  );
}
