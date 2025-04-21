// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const MainPage = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     if (!userData) {
//       navigate('/');
//     } else {
//       setUser(JSON.parse(userData));
//     }
//   }, [navigate]);

//   return (
//     <div className="container mt-5 text-center">
//       <h2 className="fw-bold">Welcome {user?.name} 👋</h2>
//       <p className="lead">You're logged in with <strong>{user?.email}</strong> at <strong>{user?.company}</strong>.</p>
//     </div>
//   );
// };

// // export default MainPage;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate } from "react-router-dom";

// const MainPage = () => {
//   const [showForm, setShowForm] = useState(false);
//   const [jobName, setJobName] = useState("");
//   const [description, setDescription] = useState("");
//   const [user, setUser] = useState({ name: "", email: "" });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (!storedUser) {
//       navigate("/login");
//     } else {
//       setUser({ name: storedUser.name, email: storedUser.email });
//     }
//   }, [navigate]);

//   const handlePostJob = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:8000/post-job", {
//         job_name: jobName,
//         description: description,
//         email: user.email,
//       });
//       alert(response.data.message);
//       localStorage.setItem("job_id", response.data.job_id); // Store job_id
//        navigate("/upload-resumes");
//     } catch (error) {
//       alert("❌ Error posting job: " + error.response?.data?.detail || error.message);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="text-center mb-4">
//         <h2>Welcome, {user.name}</h2>
//         <button className="btn btn-success mt-3" onClick={() => setShowForm(true)}>
//           Create Job
//         </button>
//       </div>

//       {showForm && (
//         <div className="card mx-auto" style={{ maxWidth: "500px" }}>
//           <div className="card-body">
//             <h5 className="card-title text-center mb-4">Post a Job</h5>
//             <form onSubmit={handlePostJob}>
//               <div className="mb-3">
//                 <label className="form-label">Job Title</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={jobName}
//                   onChange={(e) => setJobName(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Job Description</label>
//                 <textarea
//                   className="form-control"
//                   rows="4"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   required
//                 ></textarea>
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Posted By (Email)</label>
//                 <input type="email" className="form-control" value={user.email} disabled />
//               </div>
//               <div className="d-grid">
//                 <button className="btn btn-primary" type="submit">
//                   Submit Job
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MainPage;


import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // ✅ Import shared navbar

const MainPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [jobName, setJobName] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser({ name: storedUser.name, email: storedUser.email });
    }
  }, [navigate]);

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/post-job", {
        job_name: jobName,
        description: description,
        email: user.email,
      });
      alert(response.data.message);
      localStorage.setItem("job_id", response.data.job_id);
      navigate("/upload-resumes");
    } catch (error) {
      alert("❌ Error posting job: " + error.response?.data?.detail || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <Navbar show="logout" onLogout={handleLogout} /> {/* ✅ Navbar with logout */}

      <div className="container mt-5">
        <div className="text-center mb-4">
          <h2>Welcome, {user.name}</h2>
          <button className="btn btn-success mt-3" onClick={() => setShowForm(true)}>
            Create Job
          </button>
        </div>

        {showForm && (
          <div className="card mx-auto" style={{ maxWidth: "500px" }}>
            <div className="card-body">
              <h5 className="card-title text-center mb-4">Post a Job</h5>
              <form onSubmit={handlePostJob}>
                <div className="mb-3">
                  <label className="form-label">Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Job Description</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Posted By (Email)</label>
                  <input type="email" className="form-control" value={user.email} disabled />
                </div>
                <div className="d-grid">
                  <button className="btn btn-primary" type="submit">
                    Submit Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MainPage;
