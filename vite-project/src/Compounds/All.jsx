import React from "react";
import Alljobs from "./Alljobs";
import Allresumes from "./Allresume";
import CreateJob from "./CreateJob";
import Uploadresume from "./Uploadresume";
import RecentJobs from "./Recentjobs";
import Recentuploads from "./Receantuploads";
import Resumechart from "./Resumechart";

export default function All() {
  return (
    <div className="container-fluid py-4">
      <div className="mb-5">
        <h1 className="fw-bold">All Components</h1>
        <p className="text-muted">
          A single page showing main compound views in one place.
        </p>
      </div>

      <div className="mb-5">
        <h2 className="h4 mb-3">Dashboard Widgets</h2>
        <div className="row gy-4">
          <div className="col-12">
            <Resumechart />
          </div>
          <div className="col-12 col-lg-6">
            <RecentJobs />
          </div>
          <div className="col-12 col-lg-6">
            <Recentuploads />
          </div>
        </div>
      </div>

      <div className="mb-5">
        <h2 className="h4 mb-3">Lists</h2>
        <div className="row gy-4">
          <div className="col-12">
            <Alljobs />
          </div>
          <div className="col-12">
            <Allresumes />
          </div>
        </div>
      </div>

      <div className="mb-5">
        <h2 className="h4 mb-3">Forms</h2>
        <div className="row gy-4">
          <div className="col-12">
            <CreateJob />
          </div>
          <div className="col-12">
            <Uploadresume />
          </div>
        </div>
      </div>
    </div>
  );
}
