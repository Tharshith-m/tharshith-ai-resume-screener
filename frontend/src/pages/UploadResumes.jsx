// // src/pages/UploadResumes.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate } from 'react-router-dom';


// const UploadResumes = () => {
//   const [files, setFiles] = useState([]);
//   const [successFiles, setSuccessFiles] = useState([]);
//   const [failedFiles, setFailedFiles] = useState([]);
//   const [warning, setWarning] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//    const navigate = useNavigate();


//   const user_id = parseInt(localStorage.getItem("user_id"));
//   const job_id = parseInt(localStorage.getItem("job_id"));

//   const handleFileChange = (e) => {
//     setFiles(Array.from(e.target.files));
//     setWarning("");
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setFiles(Array.from(e.dataTransfer.files));
//     setWarning("");
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     };
    
//     const handleNavigation = (route) => {
//   if (successFiles.length === 0) {
//     setWarning("⚠️ Please upload resumes before accessing this feature.");
//     return;
//   }
//   navigate(route);
// };


//   const uploadResumes = async () => {
//     if (!files.length) return;
//     if (!user_id || !job_id) {
//       setWarning("User ID or Job ID not found. Please login and create/select a job first.");
//       return;
//     }

//     const formData = new FormData();
//     files.forEach(file => formData.append("files", file));
//     formData.append("user_id", user_id);
//     formData.append("job_id", job_id);

//     setIsUploading(true);
//     setWarning("");

//     try {
//       const response = await axios.post("http://localhost:8000/upload-resumes/", formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       setSuccessFiles(response.data.success || []);
//       setFailedFiles((response.data.failed || []).map(f => f.filename));

//       if (response.data.failed?.length) {
//         setWarning("Some files failed to upload. Please try again.");
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       setWarning("An error occurred while uploading. Please check your network or file format.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="container mt-5">
//           <h2 className="mb-4">Upload Resumes</h2>
//           <div className="mb-4 d-flex justify-content-end gap-2">
//             <button className="btn btn-outline-secondary" onClick={() =>handleNavigation("/search")}>
//                 🔍 Search
//             </button>
//             <button className="btn btn-outline-success" onClick={() =>handleNavigation("/ranked")}>
//                 🏆 View Ranked
//             </button>
//             </div>

//       <div
//         className="border rounded p-5 text-center bg-light"
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         style={{ cursor: "pointer" }}
//       >
//         <p className="text-muted">Drag & drop PDF files here</p>
//         <p>or</p>
//         <input type="file" multiple onChange={handleFileChange} accept=".pdf" className="form-control w-50 mx-auto" />
//       </div>

//       <button
//         className="btn btn-primary mt-4"
//         onClick={uploadResumes}
//         disabled={!files.length || isUploading}
//       >
//         {isUploading ? (
//           <>
//             <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//             Uploading...
//           </>
//         ) : (
//           "Submit"
//         )}
//       </button>

//       {warning && (
//         <div className="alert alert-warning mt-3">
//           {warning}
//         </div>
//       )}

//       {successFiles.length > 0 && (
//         <div className="mt-4">
//           <h5 className="text-success">✅ Successfully Uploaded:</h5>
//           <ul className="list-group">
//             {successFiles.map((file, idx) => (
//               <li className="list-group-item list-group-item-success" key={idx}>{file}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {failedFiles.length > 0 && (
//         <div className="mt-4">
//           <h5 className="text-danger">❌ Failed Uploads:</h5>
//           <ul className="list-group">
//             {failedFiles.map((file, idx) => (
//               <li className="list-group-item list-group-item-danger" key={idx}>{file}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadResumes;

// src/pages/UploadResumes.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar"; // ✅ Import shared navbar

const UploadResumes = () => {
  const [files, setFiles] = useState([]);
  const [successFiles, setSuccessFiles] = useState([]);
  const [failedFiles, setFailedFiles] = useState([]);
  const [warning, setWarning] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const user_id = parseInt(localStorage.getItem("user_id"));
  const job_id = parseInt(localStorage.getItem("job_id"));

  // Load uploaded files from localStorage on mount
  useEffect(() => {
    const storedSuccessFiles = JSON.parse(localStorage.getItem("successFiles")) || [];
    setSuccessFiles(storedSuccessFiles);
  }, []);

  // Persist uploaded files to localStorage when changed
  useEffect(() => {
    localStorage.setItem("successFiles", JSON.stringify(successFiles));
  }, [successFiles]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setWarning("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles(Array.from(e.dataTransfer.files));
    setWarning("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleNavigation = (route, newTab = false) => {
    if (successFiles.length === 0) {
      setWarning("⚠️ Please upload resumes before accessing this feature.");
      return;
    }
    if (newTab) {
      window.open(route, '_blank');
    } else {
      navigate(route);
    }
  };

  const uploadResumes = async () => {
    if (!files.length) return;
    if (!user_id || !job_id) {
      setWarning("User ID or Job ID not found. Please login and create/select a job first.");
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    formData.append("user_id", user_id);
    formData.append("job_id", job_id);

    setIsUploading(true);
    setWarning("");

    try {
      const response = await axios.post("http://localhost:8000/upload-resumes/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const uploaded = response.data.success || [];
      setSuccessFiles(prev => [...prev, ...uploaded]);
      setFailedFiles((response.data.failed || []).map(f => f.filename));

      if (response.data.failed?.length) {
        setWarning("Some files failed to upload. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setWarning("An error occurred while uploading. Please check your network or file format.");
    } finally {
      setIsUploading(false);
    }
    };
      const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

    return (
        // <Navbar show="logout" onLogout={handleLogout} /> 
        <> <Navbar show="logout" onLogout={handleLogout} /> {/* ✅ Navbar with logout */}
    <div className="container mt-5">
      <h2 className="mb-4">Upload Resumes</h2>

      <div className="mb-4 d-flex justify-content-end gap-2">
        <button className="btn btn-outline-secondary" onClick={() => handleNavigation("/search", true)}>
          🔍 Search
        </button>
        <button className="btn btn-outline-success" onClick={() => handleNavigation("/ranked" , true)}>
          🏆 View Ranked
        </button>
      </div>

      <div
        className="border rounded p-5 text-center bg-light"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{ cursor: "pointer" }}
      >
        <p className="text-muted">Drag & drop PDF files here</p>
        <p>or</p>
        <input type="file" multiple onChange={handleFileChange} accept=".pdf" className="form-control w-50 mx-auto" />
      </div>

      <button
        className="btn btn-primary mt-4"
        onClick={uploadResumes}
        disabled={!files.length || isUploading}
      >
        {isUploading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Uploading...
          </>
        ) : (
          "Submit"
        )}
      </button>

      {warning && (
        <div className="alert alert-warning mt-3">
          {warning}
        </div>
      )}

      {successFiles.length > 0 && (
        <div className="mt-4">
          <h5 className="text-success">✅ Successfully Uploaded:</h5>
          <ul className="list-group">
            {successFiles.map((file, idx) => (
              <li className="list-group-item list-group-item-success" key={idx}>{file}</li>
            ))}
          </ul>
        </div>
      )}

      {failedFiles.length > 0 && (
        <div className="mt-4">
          <h5 className="text-danger">❌ Failed Uploads:</h5>
          <ul className="list-group">
            {failedFiles.map((file, idx) => (
              <li className="list-group-item list-group-item-danger" key={idx}>{file}</li>
            ))}
          </ul>
        </div>
      )}
            </div>
            </>
  );
};

export default UploadResumes;

