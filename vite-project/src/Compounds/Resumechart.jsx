import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { apiUrl } from "../config/api";

export default function Resumechart() {
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState("week");
  const [loading, setLoading] = useState(false);

  const fetchChartData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        apiUrl("/api/dashboard/chart"),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Chart Data:", data);

      setChartData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Chart Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [filter]);

  const maxValue =
    chartData.length > 0
      ? Math.max(...chartData.map((item) => item.count))
      : 100;

  return (
    <div
      className="shadow-sm"
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid #e5e7eb",
        height: "420px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5
            className="fw-bold mb-1"
            style={{
              color: "#0f172a",
            }}
          >
            Resume Screening Overview
          </h5>

          <small className="text-muted">
            Resume submissions overview
          </small>
        </div>

        <select
          className="form-select form-select-sm"
          style={{
            width: "140px",
            borderRadius: "10px",
          }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <h6>Loading Chart...</h6>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="resumeGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#2563eb"
                  stopOpacity={0.18}
                />
                <stop
                  offset="95%"
                  stopColor="#2563eb"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#edf2f7"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "#64748b",
              }}
              tickFormatter={(value) =>
                value
                  ? new Date(value).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                      }
                    )
                  : ""
              }
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "#64748b",
              }}
              domain={[0, maxValue + 10]}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
              }}
              labelFormatter={(value) =>
                value
                  ? new Date(value).toLocaleDateString(
                      "en-IN"
                    )
                  : ""
              }
            />

            <Area
              type="monotone"
              dataKey="count"
              fill="url(#resumeGradient)"
              stroke="none"
            />

            <Line
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#2563eb",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: "#2563eb",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}