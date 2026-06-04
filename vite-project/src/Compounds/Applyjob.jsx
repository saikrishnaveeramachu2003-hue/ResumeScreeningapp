import React,
{
useEffect,
useState
} from "react";

import {
useParams,
useNavigate
} from "react-router-dom";
import { apiUrl } from "../config/api";

export default function ApplyJob() {
  const navigate = useNavigate();

const { jobId } =
useParams();

const [job, setJob] =
useState(null);

const [name, setName] =
useState("");

const [email, setEmail] =
useState("");

const [phone, setPhone] =
useState("");

const [file, setFile] =
useState(null);

const [loading, setLoading] =
useState(false);

useEffect(() => {


fetch(
  apiUrl(`/api/jobs/${jobId}`)
)
  .then(async (res) => {
    try {
      const text = await res.text().catch(() => "");
      if (!text) {
        // No body — set job to null so UI can show appropriate message
        return null;
      }
      try {
        return JSON.parse(text);
      } catch (e) {
        console.warn('Failed to parse job JSON', e);
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  })
  .then((data) => setJob(data))
  .catch((err) => console.log(err));


}, [jobId]);

const applyJob =
async () => {


  try {

    setLoading(true);

    const formData =
      new FormData();

    formData.append(
      "jobId",
      jobId
    );

    formData.append(
      "name",
      name
    );

    formData.append(
      "email",
      email
    );

    formData.append(
      "phone",
      phone
    );

    formData.append(
      "files",
      file
    );

  const response =
  await fetch(
    apiUrl("/api/apply"),
    {
      method: "POST",
      body: formData
    }
  );

    console.log("Status:", response.status);

    // Read a text copy for logging, but use response.clone() so we can still parse JSON
    const respText = await response.clone().text().catch(() => null);
    if (respText) console.log("Response:", respText);

    // If response isn't ok, surface the server message
    if (!response.ok) {
      const message = respText || `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json().catch(async () => {
      // If JSON parse fails, return the raw text
      return respText;
    });

    alert("Application Submitted Successfully");
    console.log(data);

  } catch (error) {

    console.log(error);

    alert(
      "Failed To Apply"
    );

  } finally {

    setLoading(false);

  }
};


if (!job)
return ( <h3>
Loading... </h3>
);

return (

<div
  className="container py-5"
>

  <div
    className="card shadow border-0"
    style={{
      borderRadius: "20px"
    }}
  >

    <div
      className="card-body p-5"
    >

      <button
        type="button"
        className="btn btn-outline-secondary btn-sm mb-4"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      <h2
        className="fw-bold"
      >
        {job.jobTitle}
      </h2>

      <hr />

      <div
        className="row"
      >

        <div
          className="col-md-6"
        >

          <p>
            <b>
              Location:
            </b>
            {" "}
            {job.location}
          </p>

          <p>
            <b>
              Experience:
            </b>
            {" "}
            {job.experienceLevel}
          </p>

        </div>

        <div
          className="col-md-6"
        >

          <p>
            <b>
              Salary:
            </b>
            {" "}
            {job.salaryRange}
          </p>

          <p>
            <b>
              Openings:
            </b>
            {" "}
            {job.openings}
          </p>

        </div>

      </div>

      <h5
        className="mt-4"
      >
        Skills Required
      </h5>

      <p>
        {job.skills}
      </p>

      <h5
        className="mt-4"
      >
        Job Description
      </h5>

      <p>
        {job.jobDescription}
      </p>

      <hr />

      <h4
        className="fw-bold"
      >
        Apply Now
      </h4>

      <div
        className="mb-3"
      >

        <label>
          Full Name
        </label>

        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e)=>
            setName(
              e.target.value
            )
          }
        />

      </div>

      <div
        className="mb-3"
      >

        <label>
          Email
        </label>

        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e)=>
            setEmail(
              e.target.value
            )
          }
        />

      </div>

      <div
        className="mb-3"
      >

        <label>
          Phone Number
        </label>

        <input
          type="text"
          className="form-control"
          value={phone}
          onChange={(e)=>
            setPhone(
              e.target.value
            )
          }
        />

      </div>

      <div
        className="mb-4"
      >

        <label>
          Upload Resume
        </label>

        <input
          type="file"
          className="form-control"
          onChange={(e)=>
            setFile(
              e.target.files[0]
            )
          }
        />

      </div>

      <button
        className="btn btn-primary btn-lg w-100"
        onClick={applyJob}
      >

        {
          loading
          ? "Submitting..."
          : "Apply Now"
        }

      </button>

    </div>

  </div>
  </div>
);
}
