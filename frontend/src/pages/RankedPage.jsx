// // src/pages/RankedResults.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { CSVLink } from "react-csv";
// import "bootstrap/dist/css/bootstrap.min.css";

// const RankedResults = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [jobTitle, setJobTitle] = useState("");
//   const [warning, setWarning] = useState("");
//   const [csvData, setCsvData] = useState([]);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);

//     const navigate = useNavigate();


//   useEffect(() => {
//       const job_id = localStorage.getItem("job_id");
//       console.log("Job ID:", job_id); // Debugging line
//     if (!job_id) {
//       setWarning("Please upload resumes and select a job first.");
//       return;
//     }

//     axios
//       .get("http://localhost:8000/rank_candidates", {
//       params: { job_id },
//     })
//       .then((response) => {
//         const { job_title, matched_candidates } = response.data;
//         setJobTitle(job_title);
//         setCandidates(matched_candidates);

//         const csv = matched_candidates.map((c) => ({
//           Name: c.person_name,
//           Email: c.email,
//           Skills: c.skills,
//           Location: c.location,
//           Branch: c.branch,
//           Experience: c.experience,
//           Resume: c.cloudinary_url,
//           Score: c.score.toFixed(2),
//         }));
//         setCsvData(csv);
//       })
//       .catch((err) => {
//         console.error(err);
//         setWarning("Failed to fetch ranked candidates. Please try again later.");
//       });
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">Ranked Candidates</h2>

//       {warning && <div className="alert alert-warning">{warning}</div>}

//       {candidates.length > 0 && (
//         <>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h5 className="text-muted">Job Title: {jobTitle}</h5>
//             <CSVLink
//               data={csvData}
//               filename={`ranked_candidates_${Date.now()}.csv`}
//               className="btn btn-outline-success"
//             >
//               Download CSV
//             </CSVLink>
//           </div>

//           <table className="table table-striped table-hover">
//             <thead className="table-dark">
//               <tr>
//                 <th>#</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Score</th>
//                 <th>Resume</th>
//               </tr>
//             </thead>
//             <tbody>
//               {candidates.map((candidate, idx) => (
//                 <tr key={candidate.mongo_id || idx}>
//                   <td>{idx + 1}</td>
//                   <td>{candidate.person_name}</td>
//                   <td>{candidate.email}</td>
//                   <td>
//                     <span className="badge bg-primary fs-6">
//                       {candidate.score.toFixed(2)}
//                     </span>
//                   </td>
//                   <td>
//                     <a
//                       href={candidate.cloudinary_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="btn btn-outline-primary btn-sm"
//                     >
//                       View
//                     </a>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}
//     </div>
//   );
// };

// export default RankedResults;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { CSVLink } from "react-csv";
// import "bootstrap/dist/css/bootstrap.min.css";

// const RankedResults = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [jobTitle, setJobTitle] = useState("");
//   const [warning, setWarning] = useState("");
//   const [csvData, setCsvData] = useState([]);
//   const [cachedKeywords, setCachedKeywords] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch cached keywords from localStorage
//     const cached = localStorage.getItem("cached_keywords");
//     if (cached) {
//       try {
//         const parsed = JSON.parse(cached);
//         setCachedKeywords(parsed);
//       } catch (err) {
//         console.error("Invalid cached keywords format");
//       }
//     }

//     const job_id = localStorage.getItem("job_id");
//     console.log("Job ID:", job_id);
//     if (!job_id) {
//       setWarning("Please upload resumes and select a job first.");
//       return;
//     }

//     axios
//       .get("http://localhost:8000/rank_candidates", {
//         params: { job_id },
//       })
//       .then((response) => {
//         const { job_title, matched_candidates } = response.data;
//         setJobTitle(job_title);
//         setCandidates(matched_candidates);

//         const csv = matched_candidates.map((c) => ({
//           Name: c.person_name,
//           Email: c.email,
//           Skills: c.skills,
//           Location: c.location,
//           Branch: c.branch,
//           Experience: c.experience,
//           Resume: c.cloudinary_url,
//           Score: c.score.toFixed(2),
//         }));
//         setCsvData(csv);
//       })
//       .catch((err) => {
//         console.error(err);
//         setWarning("Failed to fetch ranked candidates. Please try again later.");
//       });
//   }, []);

//   const handleKeywordClick = (keyword) => {
//     alert(`You clicked: ${keyword}`);
//     // You can later filter candidates based on this keyword or navigate elsewhere.
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">Ranked Candidates</h2>

//       {warning && <div className="alert alert-warning">{warning}</div>}

//       {cachedKeywords.length > 0 && (
//         <div className="mb-4">
//           <h6 className="text-muted">Search History:</h6>
//           <div className="d-flex flex-wrap gap-2">
//             {cachedKeywords.map((keyword, idx) => (
//               <span
//                 key={idx}
//                 className="badge rounded-pill bg-secondary px-3 py-2 text-white"
//                 role="button"
//                 onClick={() => handleKeywordClick(keyword)}
//               >
//                 {keyword}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       {candidates.length > 0 && (
//         <>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h5 className="text-muted">Job Title: {jobTitle}</h5>
//             <CSVLink
//               data={csvData}
//               filename={`ranked_candidates_${Date.now()}.csv`}
//               className="btn btn-outline-success"
//             >
//               Download CSV
//             </CSVLink>
//           </div>

//           <table className="table table-striped table-hover">
//             <thead className="table-dark">
//               <tr>
//                 <th>#</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Score</th>
//                 <th>Resume</th>
//               </tr>
//             </thead>
//             <tbody>
//               {candidates.map((candidate, idx) => (
//                 <tr key={candidate.mongo_id || idx}>
//                   <td>{idx + 1}</td>
//                   <td>{candidate.person_name}</td>
//                   <td>{candidate.email}</td>
//                   <td>
//                     <span className="badge bg-primary fs-6">
//                       {candidate.score.toFixed(2)}
//                     </span>
//                   </td>
//                   <td>
//                     <a
//                       href={candidate.cloudinary_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="btn btn-outline-primary btn-sm"
//                     >
//                       View
//                     </a>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}
//     </div>
//   );
// };

// export default RankedResults;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { CSVLink } from "react-csv";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Navbar from "../components/Navbar"; // ✅ Import shared navbar

// const RankedResults = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [jobTitle, setJobTitle] = useState("");
//   const [warning, setWarning] = useState("");
//   const [csvData, setCsvData] = useState([]);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const job_id = localStorage.getItem("job_id");
//     if (!job_id) {
//       setWarning("Please upload resumes and select a job first.");
//       return;
//     }

//     axios
//       .get("http://localhost:8000/rank_candidates", {
//         params: { job_id },
//       })
//       .then((response) => {
//         const { job_title, matched_candidates } = response.data;
//         setJobTitle(job_title);
//         setCandidates(matched_candidates);

//         const csv = matched_candidates.map((c) => ({
//           Name: c.person_name,
//           Email: c.email,
//           Skills: c.skills,
//           Location: c.location,
//           Branch: c.branch,
//           Experience: c.experience,
//           Resume: c.cloudinary_url,
//               Score: c.score.toFixed(2),
//         //   Score: typeof c.score === "number" ? c.score.toFixed(2) : "N/A",
//         }));
//         setCsvData(csv);
//       })
//       .catch((err) => {
//         console.error(err);
//         setWarning("Failed to fetch ranked candidates. Please try again later.");
//       });
//   }, []);

//   const fetchParsedResume = async (email) => {
//     try {
//       const response = await axios.get(`http://localhost:8000/resume/by-email?email=${email}`);
//       const { results } = response.data;
//       if (results.length > 0) {
//         setSelectedCandidate(results[0]); // Assuming there's only one match
//       }
//     } catch (error) {
//       console.error("Error fetching parsed resume", error);
//     }
//     };
//           const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//     return (
//       <>
//     <div className="container mt-5">
//       <h2 className="mb-4">Ranked Candidates</h2>

//       {warning && <div className="alert alert-warning">{warning}</div>}

//       {candidates.length > 0 && (
//                     <>
//                         <Navbar show="logout" onLogout={handleLogout} /> {/* ✅ Navbar with logout */}
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h5 className="text-muted">Job Title: {jobTitle}</h5>
//             <CSVLink
//               data={csvData}
//               filename={`ranked_candidates_${Date.now()}.csv`}
//               className="btn btn-outline-success"
//             >
//               Download CSV
//             </CSVLink>
//           </div>

//           <table className="table table-striped table-hover">
//             <thead className="table-dark">
//               <tr>
//                 <th>#</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Score</th>
//                 <th>Resume</th>
//                 <th>Parsed Resume</th> {/* New column */}
//               </tr>
//             </thead>
//             <tbody>
//                           {candidates.map((candidate, idx) => (
//                   console.log(candidate, "-----------------"),
//                 <tr key={candidate.mongo_id || idx}>
//                   <td>{idx + 1}</td>
//                   <td>{candidate.person_name}</td>
//                   <td>{candidate.email}</td>
//                   <td>
//                     <span className="badge bg-primary fs-6">
//                               {candidate.score.toFixed(2)}
//                               {/* {typeof candidate.score === "number" ? candidate.score.toFixed(2) : "N/A"} */}
                              
//                     </span>
//                   </td>
//                   <td>
//                     <a
//                       href={candidate.cloudinary_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="btn btn-outline-primary btn-sm"
//                     >
//                       View
//                     </a>
//                   </td>
//                   <td>
//                     <button
//                       className="btn btn-outline-info btn-sm"
//                       onClick={() => fetchParsedResume(candidate.email)}
//                     >
//                       View Parsed Resume
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}

//       {/* Modal for displaying parsed resume */}
//       {selectedCandidate && (
//         <div className="modal show" style={{ display: "block" }}>
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Parsed Resume of {selectedCandidate.person_name}</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   data-bs-dismiss="modal"
//                   aria-label="Close"
//                   onClick={() => setSelectedCandidate(null)}
//                 />
//               </div>
//               <div className="modal-body">
//                 <h6>Email: {selectedCandidate.email}</h6>
//                 <p><strong>Skills:</strong> {selectedCandidate.skills}</p>
//                 <p><strong>Branch:</strong> {selectedCandidate.branch}</p>
//                 <p><strong>Location:</strong> {selectedCandidate.location}</p>
//                 <p><strong>Experience:</strong> {selectedCandidate.experience}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//             </div>
//             </>
//   );
// };

// export default RankedResults;


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
