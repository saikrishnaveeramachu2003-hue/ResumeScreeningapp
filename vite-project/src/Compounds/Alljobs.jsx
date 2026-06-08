import React,
{
  useEffect,
  useState
} from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";

import {
  FaEdit,
  FaTrash,
  FaBriefcase
} from "react-icons/fa";

export default function AllJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] =
    useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {

    const token =
      localStorage.getItem("token");

    const response =
      await fetch(
        apiUrl("/api/jobs"),
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    const data =
      await response.json();

    setJobs(data);
  };

 const deleteJob = async (id) => {

  try {

    const token =
      localStorage.getItem("token");

    const response =
      await fetch(
        apiUrl(`/api/jobs/${id}`),
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    console.log(
      "Status:",
      response.status
    );

    console.log(
      await response.text()
    );

    fetchJobs();

  } catch (error) {

    console.log(error);

  }

};

  const updateJob =
    (id) => {

      window.location.href =
        `/edit-job/${id}`;

    };

  return (

    <div className="container py-4">

      <div
        className="card border-0 shadow"
        style={{
          borderRadius: "20px"
        }}
      >

        <div
          className="card-body"
        >

          <div
            className="d-flex justify-content-between align-items-center mb-4"
          >

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm me-3"
              onClick={() => navigate(-1)}
            >
              Back
            </button>

            <h3
              className="fw-bold mb-0"
            >
              <FaBriefcase />
              {" "}
              All Jobs
            </h3>

          </div>

          <table
            className="table table-hover align-middle"
          >

            <thead>

              <tr>

                <th>
                  Job Title
                </th>

                <th>
                  Location
                </th>

                <th>
                  Experience
                </th>

                <th>
                  Salary
                </th>

                <th>
                  Status
                </th>

                  <th>Apply Link</th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {jobs.map(
                (job) => (

                  <tr
                    key={job.id}
                  >

                    <td>
                      {
                        job.jobTitle
                      }
                    </td>

                    <td>
                      {
                        job.location
                      }
                    </td>

                    <td>
                      {
                        job.experienceLevel
                      }
                    </td>

                    <td>
                      {
                        job.salaryRange
                      }
                    </td>

                    <td>

                      <span
                        className="badge bg-success"
                      >
                        {
                          job.status
                        }
                      </span>
                      

                    </td>
                <td>

  <button
    className="btn btn-success btn-sm me-2"
    onClick={() =>
      navigator.clipboard.writeText(
        `/api/jobs/apply/${job.id}`
      )
    }
  >
    Copy Link
  </button>

  <button
    className="btn btn-primary btn-sm"
    onClick={() =>
      window.open(
        `/api/jobs/apply/${job.id}`,
        "_blank"
      )
    }
  >
    View
  </button>

</td>

                    <td>

                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() =>
                          updateJob(
                            job.id
                          )
                        }
                      >

                        <FaEdit />

                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          deleteJob(
                            job.id
                          )
                        }
                      >

                        <FaTrash />

                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}