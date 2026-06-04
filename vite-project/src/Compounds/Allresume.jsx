import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";

export default function Allresumes() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        apiUrl("/api/results"),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const data = await response.json();

      setResults(data);

    } catch (error) {

      console.error(error);

      alert("Error loading results");

    } finally {

      setLoading(false);

    }
  };

  const deleteResult = async (id) => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        apiUrl(`/api/delete/${id}`),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      alert("Deleted successfully");

      fetchResults();

    } catch (error) {

      console.error(error);

      alert("Error deleting result");

    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading Results...
      </div>
    );
  }

  return (
    <div style={styles.container}>

      <button
        type="button"
        style={styles.backButton}
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      <h1 style={styles.heading}>
        ATS Resume Screening Results
      </h1>

      {results.length === 0 ? (
        <div style={styles.noData}>
          No Results Found
        </div>
      ) : (
        <div style={styles.grid}>

          {results.map((item) => (

            <div
              key={item.id}
              style={styles.card}
            >

              <h3 style={styles.name}>
                {item.name || "Unknown Candidate"}
              </h3>

              <p>
                <strong>Email:</strong>{" "}
                {item.email}
              </p>

              <p>
                <strong>File:</strong>{" "}
                {item.fileName}
              </p>

              <p>
                <strong>Score:</strong>{" "}
                {item.score}%
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      item.status === "Shortlisted"
                        ? "green"
                        : item.status === "Consider"
                        ? "orange"
                        : "red",
                    fontWeight: "bold",
                  }}
                >
                  {item.status}
                </span>
              </p>

              <p>
                <strong>Reason:</strong>{" "}
                {item.reason}
              </p>

              <button
                onClick={() =>
                  deleteResult(item.id)
                }
                style={styles.deleteBtn}
              >
                Delete
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

const styles = {
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.75rem 1rem",
    borderRadius: "16px",
    border: "1px solid #cbd5e1",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: 700,
    marginBottom: "1rem",
    cursor: "pointer",
  },

  container: {
    padding: 30,
    background: "#f4f6f9",
    minHeight: "100vh",
  },

  heading: {
    textAlign: "center",
    marginBottom: 30,
  },

  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: 24,
  },

  noData: {
    textAlign: "center",
    fontSize: 20,
    marginTop: 50,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 20,
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow:
      "0px 0px 10px rgba(0,0,0,0.1)",
  },

  name: {
    marginBottom: 15,
  },

  deleteBtn: {
    marginTop: 15,
    padding: "10px 15px",
    border: "none",
    background: "#d32f2f",
    color: "#fff",
    borderRadius: 5,
    cursor: "pointer",
  },
};