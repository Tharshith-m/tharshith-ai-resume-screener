import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import UploadResumes from './pages/UploadResumes';
import SearchPage from './pages/SearchPage';
import RankedResults from './pages/RankedPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/upload-resumes" element={<UploadResumes />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/ranked" element={<RankedResults />} />
      </Routes>
    </Router>
  );
}

export default App;
