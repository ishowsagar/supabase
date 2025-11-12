// Dashboard: displays sales chart and listens for realtime updates from Supabase
import supabase from "../supabase-client";
import { useEffect, useState } from "react";
import { Chart } from "react-charts";
import Form from "../components/Form";

function Dashboard() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    // ? fetch metrics on mount
    fetchMetrics();

    // ! listen for realtime changes in sales_deals table
    const channel = supabase
      .channel("deal-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sales_deals",
        },
        (payload) => {
          console.log(payload);
          fetchMetrics(); // re-fetch when data changes
        }
      )
      .subscribe();

    // cleanup: remove channel when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // todo fetch sales metrics from Supabase (aggregated by name)
  async function fetchMetrics() {
    try {
      const { data, error } = await supabase.from("sales_deals").select(
        `
            value.sum(),
            ...user_profiles!inner(name)
          `
      );
      if (error) {
        throw error;
      }
      // * data now has name at top level: { sum: 1000, name: "Jim" }
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  }

  // ? shape data for the chart library
  const chartData = [
    {
      data: metrics.map((m) => ({
        primary: m.name,
        secondary: m.sum,
      })),
    },
  ];

  // x-axis config (names)
  const primaryAxis = {
    getValue: (d) => d.primary,
    scaleType: "band",
    padding: 0.2,
    position: "bottom",
  };

  // ! calculate max y-axis value dynamically
  function y_max() {
    if (metrics.length > 0) {
      const maxSum = Math.max(...metrics.map((m) => m.sum));
      return maxSum + 2000; // add buffer
    }
    return 5000;
  }

  // y-axis config (values)
  const secondaryAxes = [
    {
      getValue: (d) => d.secondary,
      scaleType: "linear",
      min: 0,
      max: y_max(),
      padding: {
        top: 20,
        bottom: 40,
      },
    },
  ];

  return (
    <div
      className="dashboard-wrapper"
      role="region"
      aria-label="Sales dashboard"
    >
      <div
        className="chart-container"
        role="region"
        aria-label="Sales chart and data"
      >
        <h2>Total Sales This Quarter ($)</h2>
        <div style={{ flex: 1 }}>
          <Chart
            options={{
              data: chartData,
              primaryAxis,
              secondaryAxes,
              type: "bar",
              defaultColors: ["#58d675"],
              tooltip: {
                show: false,
              },
            }}
          />
        </div>
      </div>
      <Form />
    </div>
  );
}

export default Dashboard;
