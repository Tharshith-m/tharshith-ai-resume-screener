// import React, { useState } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     company: '',
//     email: '',
//     password: '',
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const response = await axios.post('http://localhost:8000/register', formData);
//       setMessage({ type: 'success', text: response.data.message });
//       setFormData({ name: '', company: '', email: '', password: '' });
//     } catch (error) {
//       const msg = error.response?.data?.detail || 'Registration failed';
//       setMessage({ type: 'danger', text: msg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container d-flex align-items-center justify-content-center vh-100">
//       <div className="col-md-6">
//         <div className="card shadow-lg rounded">
//           <div className="card-body p-4">
//             <h3 className="mb-4 text-center">Create an Account</h3>

//             {message.text && (
//               <div className={`alert alert-${message.type}`} role="alert">
//                 {message.text}
//               </div>
//             )}

//             <form onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <label className="form-label">Full Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   className="form-control"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Company</label>
//                 <input
//                   type="text"
//                   name="company"
//                   className="form-control"
//                   value={formData.company}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Email Address</label>
//                 <input
//                   type="email"
//                   name="email"
//                   className="form-control"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="form-label">Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   className="form-control"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <button type="submit" className="btn btn-primary w-100" disabled={loading}>
//                 {loading ? 'Registering...' : 'Register'}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;


// import React, { useState } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate } from 'react-router-dom'; // ✅ Added for navigation

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     company: '',
//     email: '',
//     password: '',
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   const navigate = useNavigate(); // ✅ Hook to navigate to /login

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const response = await axios.post('http://localhost:8000/register', formData);
//       setMessage({ type: 'success', text: response.data.message });
//       setFormData({ name: '', company: '', email: '', password: '' });

//       // ✅ Redirect to /login after 2 seconds
//       setTimeout(() => {
//         navigate('/login');
//       }, 2000);
//     } catch (error) {
//       const msg = error.response?.data?.detail || 'Registration failed';
//       setMessage({ type: 'danger', text: msg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container d-flex align-items-center justify-content-center vh-100">
//       <div className="col-md-6">
//         <div className="card shadow-lg rounded">
//           <div className="card-body p-4">
//             <h3 className="mb-4 text-center">Create an Account</h3>

//             {message.text && (
//               <div className={`alert alert-${message.type}`} role="alert">
//                 {message.text}
//               </div>
//             )}

//             <form onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <label className="form-label">Full Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   className="form-control"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Company</label>
//                 <input
//                   type="text"
//                   name="company"
//                   className="form-control"
//                   value={formData.company}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Email Address</label>
//                 <input
//                   type="email"
//                   name="email"
//                   className="form-control"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="form-label">Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   className="form-control"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <button type="submit" className="btn btn-primary w-100" disabled={loading}>
//                 {loading ? 'Registering...' : 'Register'}
//               </button>
//             </form>

//             {/* ✅ Add login button below form */}
//             <div className="text-center mt-3">
//               <button className="btn btn-link" onClick={() => navigate('/login')}>
//                 Already registered? Login
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // ✅ Import the shared Navbar component
<Navbar show="login" />

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('http://localhost:8000/register', formData);
      setMessage({ type: 'success', text: response.data.message });
      setFormData({ name: '', company: '', email: '', password: '' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const msg = error.response?.data?.detail || 'Registration failed';
      setMessage({ type: 'danger', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar show="login" />
      <div className="container d-flex align-items-center justify-content-center vh-100">
        <div className="col-md-6">
          <div className="card shadow-lg rounded-4">
            <div className="card-body p-4">
              <h3 className="mb-4 text-center">Create an Account</h3>

              {message.text && (
                <div className={`alert alert-${message.type}`} role="alert">
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    name="company"
                    className="form-control"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>

              <div className="text-center mt-3">
                <button className="btn btn-link" onClick={() => navigate('/login')}>
                  Already registered? Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

