import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";

const RankedResults = () => {
  const [candidates, setCandidates] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [warning, setWarning] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const job_id = localStorage.getItem("job_id");
    if (!job_id) {
      setWarning("⚠️ Please upload resumes and select a job first.");
      return;
    }

    axios
      .get("http://localhost:8000/rank_candidates", { params: { job_id } })
      .then((response) => {
        const { job_title, matched_candidates } = response.data;
        setJobTitle(job_title);
        setCandidates(matched_candidates);

        const csv = matched_candidates.map((c) => ({
          Name: c.person_name,
          Email: c.email,
          Skills: c.skills,
          Location: c.location,
          Branch: c.branch,
          Experience: c.experience,
          Resume: c.cloudinary_url,
          Score: c.score.toFixed(2),
        }));
        setCsvData(csv);
      })
      .catch((err) => {
        console.error(err);
        setWarning("❌ Failed to fetch ranked candidates. Please try again later.");
      });
  }, []);

  const fetchParsedResume = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8000/resume/by-email?email=${email}`);
      const { results } = response.data;
      if (results.length > 0) setSelectedCandidate(results[0]);
    } catch (error) {
      console.error("Error fetching parsed resume", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <Navbar show="logout" onLogout={handleLogout} />
      <div className="container mt-5">
        <h2 className="text-center mb-4 fw-bold text-primary">🎯 Ranked Candidates</h2>

        {warning && (
          <div className="alert alert-warning text-center fs-6 fw-medium">{warning}</div>
        )}

        {candidates.length > 0 && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="text-muted">Job Title: <span className="text-dark fw-semibold">{jobTitle}</span></h5>
              <CSVLink
                data={csvData}
                filename={`ranked_candidates_${Date.now()}.csv`}
                className="btn btn-outline-success shadow-sm"
              >
                ⬇️ Download CSV
              </CSVLink>
            </div>

            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered align-middle shadow-sm">
                <thead className="table-dark">
                  <tr className="text-center">
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Score</th>
                    <th>Resume</th>
                    <th>Parsed Resume</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate, idx) => (
                    <tr key={candidate.mongo_id || idx} className="text-center">
                      <td>{idx + 1}</td>
                      <td>{candidate.person_name}</td>
                      <td>{candidate.email}</td>
                      <td>
                        <span className="badge bg-primary fs-6 px-3 py-2">
                          {candidate.score.toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <a
                          href={candidate.cloudinary_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          📄 View
                        </a>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-info btn-sm"
                          onClick={() => fetchParsedResume(candidate.email)}
                        >
                          🔍 View Parsed
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Modal for displaying parsed resume */}
        {selectedCandidate && (
          <div className="modal show fade d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content shadow">
                <div className="modal-header">
                  <h5 className="modal-title text-primary">📘 Parsed Resume of {selectedCandidate.person_name}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedCandidate(null)}
                  />
                </div>
                <div className="modal-body">
                  <p><strong>Email:</strong> {selectedCandidate.email}</p>
                  <p><strong>Skills:</strong> {selectedCandidate.skills}</p>
                  <p><strong>Branch:</strong> {selectedCandidate.branch}</p>
                  <p><strong>Location:</strong> {selectedCandidate.location}</p>
                  <p><strong>Experience:</strong> {selectedCandidate.experience}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RankedResults;
