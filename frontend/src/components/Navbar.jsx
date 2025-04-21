// // src/components/Navbar.js

// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const Navbar = ({ show, onLogout }) => {
//   const navigate = useNavigate();

// const handleNavigate = (route) => {
//   if (route === '/register') {
//     navigate('/'); // 👈 This sends you to localhost:3000/
//   } else {
//             if (route === '/main') {
//         localStorage.clear(); // Clear localStorage when AI Resume Screener is clicked
//       }
//     navigate(route); // 👈 Handles other routes normally
//   }
//     };

//   const handleMainNavigation = () => {
//     // ✅ Clear only UploadResume related storage
//     localStorage.removeItem("job_id");
//     // If you store other resume-related data, clear them here too
//     // localStorage.removeItem("resumeData"); or any other keys
    
//     navigate('/main');
//   };
    
//   const handleLogout = () => {
//     localStorage.clear(); // Clear localStorage on logout
//     onLogout(); // Call parent logout logic
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 shadow-sm">
//       <span
//         className="navbar-brand fw-bold fs-4"
//         style={{ cursor: 'pointer' }}
//         onClick={handleMainNavigation}
//       >
//         AI Resume Screener
//       </span>

//       <div className="ms-auto">
//         {show === 'login' && (
//           <button className="btn btn-outline-light" onClick={() => handleNavigate('/login')}>
//             Login
//           </button>
//         )}

//         {show === 'register' && (
//           <button className="btn btn-outline-light" onClick={() => handleNavigate('/register')}>
//             Register
//           </button>
//         )}

//         {show === 'logout' && (
//           <button className="btn btn-outline-light" onClick={handleLogout}>
//             Logout
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// src/components/Navbar.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ show, onLogout }) => {
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    if (route === '/register') {
      navigate('/'); // Redirect to home on register
    } else {
      if (route === '/main') {
        // Clear localStorage only for job and upload-related data
        preserveLoginAndClearUploadData();
      }
      navigate(route);
    }
  };

  const preserveLoginAndClearUploadData = () => {
    // Save login-related data
    const userId = localStorage.getItem("user_id");
    const userEmail = localStorage.getItem("user_email");

    // Clear everything
    localStorage.clear();

    // Restore login-related data
    if (userId) localStorage.setItem("user_id", userId);
    if (userEmail) localStorage.setItem("user_email", userEmail);
  };

  const handleMainNavigation = () => {
    preserveLoginAndClearUploadData();
    navigate('/main');
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all data on logout
    onLogout(); // Trigger logout logic passed as prop
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 shadow-sm">
      <span
        className="navbar-brand fw-bold fs-4"
        style={{ cursor: 'pointer' }}
        onClick={handleMainNavigation}
      >
        AI Resume Screener
      </span>

      <div className="ms-auto">
        {show === 'login' && (
          <button className="btn btn-outline-light" onClick={() => handleNavigate('/login')}>
            Login
          </button>
        )}

        {show === 'register' && (
          <button className="btn btn-outline-light" onClick={() => handleNavigate('/register')}>
            Register
          </button>
        )}

        {show === 'logout' && (
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
