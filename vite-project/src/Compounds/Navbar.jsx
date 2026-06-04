
import React from "react";
import { FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaBriefcase,
  FaUpload,
  FaFileAlt,
  FaStar,
  FaClock,
  FaTimesCircle,
  FaChartBar,
  FaCog,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (

    <div style={styles.sidebar}>

      <div>

        <h1 style={styles.logo}>
          Smart ATS
        </h1>

        <div style={styles.menu}>

          <Link
            to="/dashboard"
            style={styles.link}
          >
            <MenuItem
              icon={<FaTachometerAlt />}
              title="Dashboard"
            />
          </Link>

          <Link
            to="/create-job"
            style={styles.link}
          >
            <MenuItem
              icon={<FaBriefcase />}
              title="Create Job"
            />
          </Link>

          <Link
            to="/upload-resume"
            style={styles.link}
          >
            
            <MenuItem
              icon={<FaUpload />}
              title="Upload Resume"
            />
          </Link>
          <Link
            to="/all-jobs"
            style={styles.link}
          >
            
            <MenuItem
              icon={<FaBriefcase/>}
              title="All Jobs"
            />
          </Link>

          <Link
            to="/all-resumes"
            style={styles.link}
          >
            <MenuItem
              icon={<FaFileAlt />}
              title="All Resumes"
            />
          </Link>

          <Link
            to="/all"
            style={styles.link}
          >
            <MenuItem
              icon={<FaStar />}
              title="All"
            />
          </Link>

        </div>

      </div>

      <button style={styles.logoutBtn} onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </button>

    </div>
  );
}

function MenuItem({
  icon,
  title
}) {

  return (

    <div style={styles.menuItem}>

      {icon}

      <span>{title}</span>

    </div>
  );
}

const styles = {

  sidebar: {
    width: 270,
    background: "#041c3c",
    color: "#fff",
    padding: 20,
    minHeight: "100vh",
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
    background: "#0b2b55",
  },

  link: {
    textDecoration: "none",
    color: "#fff",
  },

  logoutBtn: {
    marginTop: 30,
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
};

