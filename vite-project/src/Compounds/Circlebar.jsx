import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { apiUrl } from "../config/api";

export default function Circlebar() {
  const [stats, setStats] = useState({
    total: 0,
    shortlisted: 0,
    underReview: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchStatusData();
  }, []);

  const fetchStatusData = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        apiUrl("/api/dashboard/status-distribution"),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const chartData = [
    {
      name: "Shortlisted",
      value: stats.shortlisted,
      color: "#2563eb",
    },
    {
      name: "Under Review",
      value: stats.underReview,
      color: "#f59e0b",
    },
    {
      name: "Rejected",
      value: stats.rejected,
      color: "#ef4444",
    },
  ];

  return (
    <div
      className="shadow-sm "
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid #e5e7eb",
        height: "420px"

      }}
    >
      <h5 className="fw-bold mb-4">
        Resume Status Distribution
      </h5>

      <div className="row align-items-center">
        <div className="col-md-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div
            style={{
              position: "relative",
              marginTop: "-145px",
              textAlign: "center",
            }}
          >
            <h2>{stats.total}</h2>
            <p>Total</p>
          </div>
        </div>

        <div className="col-md-6">
          {chartData.map((item) => {
            const percentage =
              stats.total > 0
                ? Math.round((item.value / stats.total) * 100)
                : 0;

            return (
              <div
                key={item.name}
                className="d-flex justify-content-between mb-4"
              >
                <div>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      display: "inline-block",
                      background: item.color,
                      marginRight: "10px",
                    }}
                  ></span>

                  {item.name}
                </div>

                <strong>
                  {percentage}% ({item.value})
                </strong>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}