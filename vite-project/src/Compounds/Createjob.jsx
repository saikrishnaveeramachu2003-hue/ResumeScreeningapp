import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";

export default function CreateJob() {
  const navigate = useNavigate();

  const [job, setJob] = useState({
    jobTitle: "",
    jobDescription: "",
    skills: "",
    experience: "",
    location: "",
    experienceLevel: "",
    salaryRange: "",
    openings: "",
    education: ""
  });

  const [applyUrl, setApplyUrl] = useState("");

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        apiUrl("/api/jobs"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(job)
        }
      );

      console.log("Status:", response.status);
      const text = await response.clone().text().catch(() => "");
      console.log("Response:", text);

      if (!response.ok) {
        const msg = text || `Request failed with status ${response.status}`;
        throw new Error(msg);
      }

      let data = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.warn("Failed to parse create job response JSON", e);
          data = {};
        }
      }

      setApplyUrl(data.applyUrl || "");

    } catch (error) {

      console.log(error);

      alert("Failed To Create Job");

    }

  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  const styles = {
    page: {
      background: "#eef4ff",
      minHeight: "100vh"
    },
    hero: {
      background: "linear-gradient(135deg,#2563eb,#4f46e5)",
      borderRadius: "24px",
      color: "#fff"
    },
    card: {
      borderRadius: "28px",
      boxShadow: "0 28px 80px rgba(15,23,42,0.08)"
    },
    section: {
      background: "#ffffff",
      borderRadius: "24px",
      padding: "32px"
    },
    label: {
      fontWeight: 600,
      color: "#1e293b"
    },
    input: {
      minHeight: "52px",
      borderRadius: "16px",
      border: "1px solid #cbd5e1",
      background: "#f8fafc",
      padding: "0.95rem 1rem",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease"
    },
    textarea: {
      minHeight: "160px",
      borderRadius: "18px",
      border: "1px solid #cbd5e1",
      background: "#f8fafc",
      padding: "1rem",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease"
    },
    fieldHint: {
      marginTop: "6px",
      fontSize: "0.9rem",
      color: "#64748b"
    },
    button: {
      background: "linear-gradient(135deg,#2563eb,#4f46e5)",
      color: "#fff",
      border: "none",
      borderRadius: "16px",
      padding: "14px 1.5rem",
      fontWeight: 600,
      fontSize: "16px",
      boxShadow: "0 18px 40px rgba(37,99,235,0.2)",
      cursor: "pointer"
    },
    successBox: {
      background: "#ecfdf5",
      border: "1px solid #22c55e",
      borderRadius: "18px",
      padding: "22px",
      marginTop: "24px"
    }
  };

  return (

    <div className="container-fluid py-5 px-4" style={styles.page}>

      <div className="mb-4 p-5" style={styles.hero}>
        <button
          type="button"
          className="btn btn-outline-light btn-sm mb-3"
          onClick={handleBack}
        >
          Back
        </button>
        <h2 className="fw-bold mb-2">Create New Job</h2>
        <p className="mb-0 text-white-75">
          Publish jobs and attract top talent with polished job postings.
        </p>
      </div>

      <div className="card border-0" style={styles.card}>
        <div className="card-body p-4 p-lg-5" style={styles.section}>
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
              <div>
                <h4 className="fw-bold mb-2">Job Information</h4>
                <p className="mb-0 text-secondary" style={{ maxWidth: 520 }}>
                  Add the role details that candidates need to understand what you are hiring for.
                </p>
              </div>
              <span className="badge bg-primary rounded-pill py-2 px-3">
                ATS-ready posting
              </span>
            </div>

            <div className="row g-3">
              <div className="col-lg-6">
                <label className="form-label" style={styles.label}>
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  className="form-control"
                  style={styles.input}
                  placeholder="e.g. Senior React Developer"
                  value={job.jobTitle}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-lg-6">
                <label className="form-label" style={styles.label}>
                  Experience Level
                </label>
                <select
                  name="experienceLevel"
                  className="form-select"
                  style={styles.input}
                  value={job.experienceLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select level</option>
                  <option>Fresher</option>
                  <option>1-3 Years</option>
                  <option>3-5 Years</option>
                  <option>5+ Years</option>
                </select>
              </div>

              <div className="col-lg-6">
                <label className="form-label" style={styles.label}>
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  style={styles.input}
                  placeholder="City, State or Remote"
                  value={job.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-lg-6">
                <label className="form-label" style={styles.label}>
                  Salary Range
                </label>
                <input
                  type="text"
                  name="salaryRange"
                  className="form-control"
                  style={styles.input}
                  placeholder="4 LPA - 8 LPA"
                  value={job.salaryRange}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg-6">
                <label className="form-label" style={styles.label}>
                  Openings
                </label>
                <input
                  type="number"
                  name="openings"
                  className="form-control"
                  style={styles.input}
                  placeholder="1"
                  value={job.openings}
                  onChange={handleChange}
                  min="1"
                />
              </div>

              <div className="col-lg-6">
                <label className="form-label" style={styles.label}>
                  Education
                </label>
                <input
                  type="text"
                  name="education"
                  className="form-control"
                  style={styles.input}
                  placeholder="B.Tech, MCA, MBA, etc."
                  value={job.education}
                  onChange={handleChange}
                />
              </div>
            </div>

            <hr className="my-5" />

            <div className="mb-4">
              <h4 className="fw-bold mb-2">Requirements</h4>
              <p className="text-secondary mb-3">
                Specify the skills and experience required for this role.
              </p>
              <label className="form-label" style={styles.label}>
                Skills
              </label>
              <input
                type="text"
                name="skills"
                className="form-control"
                style={styles.input}
                placeholder="Java, Spring Boot, React"
                value={job.skills}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label" style={styles.label}>
                Experience
              </label>
              <input
                type="text"
                name="experience"
                className="form-control"
                style={styles.input}
                placeholder="3+ years in full stack development"
                value={job.experience}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <h4 className="fw-bold mb-3">Job Description</h4>
              <textarea
                rows="8"
                name="jobDescription"
                className="form-control"
                style={styles.textarea}
                placeholder="Describe responsibilities, requirements and expectations..."
                value={job.jobDescription}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="w-100" style={styles.button}>
              🚀 Create & Publish Job
            </button>
          </form>

          {applyUrl && (
            <div style={styles.successBox}>
              <h5 className="text-success mb-2">✅ Job Published Successfully</h5>
              <p className="mb-2">Public Apply URL</p>
              <input
                type="text"
                className="form-control"
                style={styles.input}
                value={applyUrl}
                readOnly
              />
              <button
                className="btn btn-success mt-3"
                style={{ borderRadius: "14px" }}
                onClick={() => navigator.clipboard.writeText(applyUrl)}
              >
                Copy URL
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}