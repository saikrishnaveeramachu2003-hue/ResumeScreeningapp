import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";

export default function Uploadresume() {
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobDescription || files.length === 0) {
      alert("Please enter job description and select resumes");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const token = localStorage.getItem("token");
      const res = await fetch(
        apiUrl("/api/upload"),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error(error);
      alert("Error uploading resumes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <button
              type="button"
              style={styles.backButton}
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <h1 style={styles.title}>Resume Screening</h1>
            <p style={styles.subtitle}>Upload resumes and get AI-powered scoring in one click.</p>
          </div>
          <span style={styles.badge}>Fast Resume Match</span>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Job Description</label>
            <textarea
              rows="8"
              placeholder="Enter job description..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={styles.textarea}
            />
            <span style={styles.fieldHint}>Use a short summary of the role to improve screening accuracy.</span>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Upload Resumes</label>
            <div style={styles.filePicker}>
              <input
                type="file"
                id="resumeUpload"
                multiple
                onChange={handleFileChange}
                style={styles.fileInput}
              />
              <span style={styles.fileText}>
                {files.length > 0 ? `${files.length} file(s) selected` : "Choose resume files to upload"}
              </span>
            </div>
            <span style={styles.fieldHint}>Supported formats: PDF, DOC, DOCX.</span>
          </div>

          <button type="submit" style={styles.button}>
            {loading ? "Uploading..." : "Upload Resumes"}
          </button>
        </form>

        {response.length > 0 && (
          <div style={styles.results}>
            <h3 style={styles.resultsTitle}>Upload Results</h3>
            {response.map((item, index) => (
              <div key={index} style={styles.resultCard}>
                <p><strong>File:</strong> {item.fileName}</p>
                <p><strong>Status:</strong> {item.status}</p>
                <p><strong>Request ID:</strong> {item.requestId}</p>
                <p><strong>Success:</strong> {item.success ? "Yes" : "No"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#eef4ff",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: "760px",
    background: "#fff",
    padding: "36px",
    borderRadius: "28px",
    boxShadow: "0 24px 70px rgba(15,23,42,0.12)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "1rem",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  title: {
    fontSize: "2rem",
    margin: 0,
    color: "#0f172a",
  },
  subtitle: {
    marginTop: "10px",
    color: "#64748b",
    lineHeight: 1.7,
    maxWidth: "520px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.75rem 1rem",
    background: "#eff6ff",
    color: "#1d4ed8",
    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "0.9rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontWeight: 700,
    color: "#0f172a",
    fontSize: "0.95rem",
  },
  textarea: {
    width: "100%",
    padding: "1rem 1rem",
    borderRadius: "18px",
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    resize: "vertical",
    minHeight: "160px",
    fontSize: "1rem",
    color: "#0f172a",
    outline: "none",
  },
  fieldHint: {
    color: "#64748b",
    fontSize: "0.92rem",
  },
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.7rem 1rem",
    borderRadius: "16px",
    border: "1px solid #cbd5e1",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: 700,
    marginBottom: "1rem",
    cursor: "pointer",
  },
  filePicker: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    padding: "18px 20px",
    borderRadius: "18px",
    border: "1px dashed #cbd5e1",
    background: "#f8fafc",
    position: "relative",
  },
  fileInput: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
  },
  fileText: {
    color: "#334155",
    fontSize: "0.98rem",
    zIndex: 1,
  },
  button: {
    width: "100%",
    padding: "14px 20px",
    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
    color: "#fff",
    border: "none",
    borderRadius: "16px",
    boxShadow: "0 16px 32px rgba(37,99,235,0.2)",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  results: {
    marginTop: "32px",
  },
  resultsTitle: {
    marginBottom: "18px",
    fontSize: "1.15rem",
    color: "#0f172a",
  },
  resultCard: {
    background: "#f8fafc",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    padding: "18px",
    marginBottom: "14px",
    color: "#0f172a",
  },
};