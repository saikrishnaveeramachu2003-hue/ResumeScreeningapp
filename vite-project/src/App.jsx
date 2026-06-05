import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Compounds/Home";
import DashboardView from "./Compounds/Dahboardview";
import Login from "./Compounds/Login";
import SignIn from "./Compounds/SignIn";
import AuthProvider from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import CreateJob from "./Compounds/Createjob";
import Uploadresume from "./Compounds/Uploadresume";
import Allresumes from "./Compounds/Allresume";
import Alljobs from "./Compounds/Alljobs";
import ApplyJob from "./Compounds/Applyjob";
import All from "./Compounds/All";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Signup Page */}
        <Route path="/signup" element={<Login/>} />
        {/* Login Page */}
        <Route path="/login" element={<SignIn/>} />

        {/* Dashboard - requires authentication */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardView />
          </ProtectedRoute>
        } />
        <Route path="/create-job" element={<CreateJob />} />
        <Route path="/upload-resume" element={<Uploadresume />} />
        <Route path="/all-resumes" element={<Allresumes />} />
        <Route path="/all-jobs" element={<Alljobs />} />
        <Route path="/all" element={<All />} />
        <Route path="/apply/:jobId" element={<ApplyJob />}/>

        {/* 404 Page - redirect unknown routes to Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </AuthProvider>
  );
}