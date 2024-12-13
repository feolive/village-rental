"use client";
import { Bar } from "react-chartjs-2";

export default function DateSalesChart({ sales }: { sales: any }) {
  const d: any = {
    datasets: [
      {
        backgroundColor: "#FF8C42",
        borderColor: "#FF8C42",
        borderWidth: 1,
      },
    ],
  };
  d.labels = sales?.labels;
  d.datasets[0].data = sales?.data;

  return (
    <Bar className="w-3/4 h-3/4" data={d} options={{ indexAxis: "y" }} />
  );
}
