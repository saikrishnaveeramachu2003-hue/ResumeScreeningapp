import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";

export default function RecentJobs() {

  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        apiUrl("/api/jobs/recent"),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Status:", response.status);

      const text = await response.clone().text().catch(() => "");
      console.log("Response:", text);

      if (response.status === 401) {
        // Unauthorized - clear token and redirect to login
        try {
          localStorage.removeItem("token");
        } catch (e) {}
        navigate("/login");
        return;
      }

      let data = [];
      if (!text) {
        data = [];
      } else {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.warn("Failed to parse jobs JSON", e);
          data = [];
        }
      }

      setJobs(Array.isArray(data) ? data : []);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="card shadow-sm"
      style={{
        borderRadius: "16px",
        minHeight: "350px",
      }}
    >
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">
            Recent Jobs
          </h5>

          <button
            className="btn btn-outline-primary btn-sm"
          >
            View All
          </button>
        </div>

        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Resumes</th>
              <th>Shortlisted</th>
              <th>Created On</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {jobs.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-muted"
                >
                  No Jobs Found
                </td>
              </tr>
            ) : (

              jobs.map((job) => (
                <tr key={job.id}>

                  <td>{job.jobTitle}</td>

                  <td>
                    {job.resumes || 0}
                  </td>

                  <td>
                    {job.shortlisted || 0}
                  </td>

                  <td>
                    {job.createdAt
                      ? new Date(job.createdAt)
                          .toLocaleDateString()
                      : "-"
                    }
                  </td>

                  <td>
                    <span
                      className={
                        job.status === "Active"
                          ? "badge bg-success"
                          : "badge bg-secondary"
                      }
                    >
                      {job.status}
                    </span>
                  </td>

                </tr>
              ))

            )}

          </tbody>
        </table>

        <div className="text-center mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={() =>
              navigate("/create-job")
            }
          >
            + Create New Job
          </button>
        </div>

      </div>
    </div>
  );
}