
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Resumechart from "./Resumechart";
import Circlebar from "./Circlebar";
import RecentJobs from "./Recentjobs";
import Recentuploads from "./Receantuploads";
import { apiUrl } from "../config/api";


import {
  FaBell,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";



export default function DashboardView() {

  // =========================
  // STATES
  // =========================

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalResumes: 0,
    shortlisted: 0,
    rejected: 0,
    underReview: 0,
  });

  const [jobs, setJobs] = useState([]);

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);
  const hrName = localStorage.getItem("hrName");

  // =========================
  // API CALLS
  // =========================

  useEffect(() => {

    fetchDashboardStats();

    fetchJobs();

    fetchResults();

  }, []);

  // =========================
  // FETCH DASHBOARD STATS
  // =========================

  const fetchDashboardStats = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        apiUrl("/api/dashboard/stats"),
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch stats"
        );
      }

      const data =
        await response.json();

      console.log("Dashboard Stats:", data);

      setStats(data);

    } catch (error) {

      console.error(error);

    }
  };

  // =========================
  // FETCH JOBS
  // =========================

  const fetchJobs = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        apiUrl("/api/jobs"),
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch jobs"
        );
      }

      const data =
        await response.json();

      console.log("Jobs:", data);

      setJobs(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(error);

    }
  };

  // =========================
  // FETCH RESULTS
  // =========================

  const fetchResults = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        apiUrl("/api/results"),
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch results"
        );
      }

      const data =
        await response.json();

      console.log("Results:", data);

      setResults(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // DASHBOARD CARDS
  // =========================
const dashboardCards = [
  {
    title: "Total Jobs",
    value: stats.totalJobs,
    color: "#2563eb",
    icon: <FaBriefcase size={24} color="white" />,
  },
  {
    title: "Total Resumes",
    value: stats.totalResumes,
    color: "#16a34a",
    icon: <FaFileAlt size={24} color="white" />,
  },
  {
    title: "Shortlisted",
    value: stats.shortlisted,
    color: "#7c3aed",
    icon: <FaCheckCircle size={24} color="white" />,
  },
  {
    title: "Under Review",
    value: stats.underReview,
    color: "#f59e0b",
    icon: <FaClock size={24} color="white" />,
  },
  {
    title: "Rejected",
    value: stats.rejected,
    color: "#ef4444",
    icon: <FaTimesCircle size={24} color="white" />,
  },
];

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div style={styles.loading}>
        Loading Dashboard...
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (

    <div style={styles.container}>

     {/* SIDEBAR */}

<Navbar />

      {/* MAIN */}

      <div style={styles.main}>

        {/* HEADER */}

        <div style={styles.header}>

          <div>

          <h3>
  Welcome Back 👋 
</h3>
            <p style={styles.grayText}>
              
            </p>

          </div>

          <div style={styles.profile}>

            <FaBell size={20} />

            <div style={styles.avatar}>
              SK
            </div>

            <div>

            

              <p style={styles.grayText}>
                HR Manager
              </p>

            </div>

          </div>

        </div>

        {/* STATS */}
        <div style={styles.cardGrid}>
  {dashboardCards.map((item, index) => (
    <div
      key={index}
      style={styles.card}
    >
      <div
        style={{
          ...styles.cardCircle,
          background: item.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {item.icon}
      </div>

      <div>
        <p style={styles.grayText}>
          {item.title}
        </p>

        <h2>
          {item.value}
        </h2>
      </div>
    </div>
  ))}
</div>
<div className="row ">
  <div className="col-md-8 mb-3">
    <div >
      <Resumechart />
    </div>
  </div>

  <div className="col-md-4 mb-3">
    <div >
      <Circlebar />
    </div>
  </div>
</div>

<div className="row">
  <div className="col-lg-6">
    <RecentJobs />
  </div>
<div className="col-lg-6">
    <Recentuploads />
  </div>
 
</div>


       

        {/* RESULTS */}

      

      </div>

    </div>
  );
}

// =========================
// MENU ITEM
// =========================

function MenuItem({
  icon,
  title,
  active,
}) {

  return (

    <div
      style={{
        ...styles.menuItem,
        background: active
          ? "#2563eb"
          : "transparent",
      }}
    >

      {icon}

      <span>{title}</span>

    </div>
  );
}

// =========================
// STYLES
// =========================

const styles = {

  container: {
    display: "flex",
    background: "#f4f7fb",
    minHeight: "100vh",
    fontFamily: "Arial",
  },

  sidebar: {
    width: 270,
    background: "#041c3c",
    color: "#fff",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logo: {
    fontSize: 30,
    marginBottom: 40,
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    padding: 14,
    borderRadius: 10,
    cursor: "pointer",
  },

  companyCard: {
    background: "#0b2b55",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },

  logoutBtn: {
    width: "100%",
    padding: 14,
    border: "none",
    borderRadius: 10,
    background: "#ef4444",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: 30,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: 15,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  grayText: {
    color: "#666",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: 20,
    marginBottom: 30,
  },

  card: {
    background: "#fff",
    padding: 25,
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    gap: 20,
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)",
  },

  cardCircle: {
    width: 55,
    height: 55,
    borderRadius: "50%",
  },

  section: {
    background: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)",
  },

  sectionTitle: {
    marginBottom: 20,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  activeBadge: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "5px 10px",
    borderRadius: 20,
    fontSize: 12,
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",
    gap: 20,
  },

  resultCard: {
    border: "1px solid #eee",
    padding: 20,
    borderRadius: 12,
  },

  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: 28,
    fontWeight: "bold",
  },
};

