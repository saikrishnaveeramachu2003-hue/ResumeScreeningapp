import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { apiUrl } from "../config/api";

export default function RecentUploads() {

const [uploads, setUploads] = useState([]);

useEffect(() => {
fetchUploads();
}, []);

const fetchUploads = async () => {


try {

  const token =
    localStorage.getItem("token");

  const response = await fetch(
    apiUrl("/api/dashboard/latest-uploads"),
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
      try {
        localStorage.removeItem("token");
      } catch (e) {}
      // leave uploads empty and return
      return;
    }

    let data = [];
    if (!text) {
      data = [];
    } else {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn("Failed to parse uploads JSON", e);
        data = [];
      }
    }

    setUploads(Array.isArray(data) ? data : []);

} catch (error) {

  console.log(error);

}


};

return (


<div
  className="card shadow-sm"
  style={{
    borderRadius: "16px",
    minHeight: "380px",
    border: "none"
  }}
>

  <div className="card-body">

    <div className="d-flex justify-content-between align-items-center mb-3">

      <h5
        className="fw-bold mb-0"
        style={{
          color: "#0f172a"
        }}
      >
        Recent Uploads
      </h5>

      <button
        className="btn btn-outline-primary btn-sm"
      >
        View All
      </button>

    </div>

    <table className="table align-middle">

      <thead>
        <tr>
          <th>File Name</th>
          <th>Job Title</th>
          <th>Uploaded On</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>

        {uploads.length === 0 ? (

          <tr>
            <td
              colSpan="4"
              className="text-center text-muted"
            >
              No Uploads Found
            </td>
          </tr>

        ) : (

          uploads.map((item, index) => (

            <tr key={index}>

              <td>

                <div
                  className="d-flex align-items-center gap-2"
                >

                  <FaFilePdf
                    color="#ef4444"
                    size={18}
                  />

                  <span
                    style={{
                      fontSize: "13px"
                    }}
                  >
                    {item.fileName}
                  </span>

                </div>

              </td>

              <td>
                {item.jobTitle}
              </td>

              <td>
                {item.uploadedOn
                  ? new Date(
                      item.uploadedOn
                    ).toLocaleDateString()
                  : "-"
                }
              </td>

              <td>

                <span
                  className={
                    item.status === "Shortlisted"
                      ? "badge bg-success"
                      : item.status === "Consider"
                      ? "badge bg-warning text-dark"
                      : item.status === "Rejected"
                      ? "badge bg-danger"
                      : "badge bg-primary"
                  }
                >
                  {item.status}
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
      >
        Upload Resumes
      </button>

    </div>

  </div>

</div>
);
}
