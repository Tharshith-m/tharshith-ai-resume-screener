import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CSVLink } from 'react-csv';
import Navbar from "../components/Navbar"; // ✅ Import shared navbar

const SearchPage = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [searchTerms, setSearchTerms] = useState({ skills: '', location: '', experience: '' });
  const [warning, setWarning] = useState("");
  const [cachedSearches, setCachedSearches] = useState([]);
  const job_id = localStorage.getItem("job_id");

  const [formInputs, setFormInputs] = useState({ skills: '', location: '', experience: '' });

  const generateCacheKey = (job_id, skills, location, experience) => {
    return `candidate_cache:${job_id}|${skills?.trim().toLowerCase() || ''}|${location?.trim().toLowerCase() || ''}|${experience || ''}`;
  };

  const saveToCache = (key, data) => {
    const cacheEntry = {
      timestamp: Date.now(),
      data
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
  };

  const loadFromCache = (key, expiryMinutes = 10) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    try {
      const parsed = JSON.parse(cached);
      const age = (Date.now() - parsed.timestamp) / (1000 * 60);
      if (age > expiryMinutes) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.data;
    } catch (err) {
      console.error("Failed to parse cached data", err);
      localStorage.removeItem(key);
      return null;
    }
  };

  const prepareCSV = (results) => {
    const csvRows = results.map(c => ({
      Name: c.person_name,
      Email: c.email,
      Skills: c.skills,
      Location: c.location,
      Experience: c.experience_pretty,
      ResumeURL: c.cloudinary_url,
      Score: c.score,
      ...searchTerms
    }));
    setCsvData(csvRows);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    if (!job_id) {
      setWarning("Please upload resumes and create/select a job first.");
      return;
    }

    const { skills, location, experience } = formInputs;
    if (!skills && !location && !experience) {
      setWarning("Please provide at least one search criteria.");
      return;
    }

    setSearchTerms({ skills, location, experience });

    const cacheKey = generateCacheKey(job_id, skills, location, experience);
    const cachedResults = loadFromCache(cacheKey);

    if (cachedResults) {
      setCandidates(cachedResults);
      prepareCSV(cachedResults);
      setWarning("");
      return;
    }

    try {
      const res = await axios.get("http://localhost:8000/candidates", {
        params: {
          job_id: parseInt(job_id),
          ...(skills && { skills }),
          ...(location && { location }),
          ...(experience && { experience }),
        },
      });

      const results = res.data.results || [];
      setCandidates(results);
      setJobTitle("Searched Job");
      prepareCSV(results);
      saveToCache(cacheKey, results);
      setWarning("");
    } catch (err) {
      console.error(err);
      setWarning("Error fetching candidates. Try again later.");
    }
  };

  const handleCachedSearchClick = async (filter) => {
    const { Skills, Location, Experience } = filter;

    const mappedInputs = {
      skills: Skills !== 'Any' ? Skills : '',
      location: Location !== 'Any' ? Location : '',
      experience: Experience !== 'Any' ? Experience : ''
    };

    setFormInputs(mappedInputs);
    setSearchTerms(mappedInputs);

    const cacheKey = generateCacheKey(job_id, mappedInputs.skills, mappedInputs.location, mappedInputs.experience);
    const cachedResults = loadFromCache(cacheKey);

    if (cachedResults) {
      setCandidates(cachedResults);
      prepareCSV(cachedResults);
      setWarning("");
      return;
    }

    try {
      const res = await axios.get("http://localhost:8000/candidates", {
        params: {
          job_id: parseInt(job_id),
          ...(mappedInputs.skills && { skills: mappedInputs.skills }),
          ...(mappedInputs.location && { location: mappedInputs.location }),
          ...(mappedInputs.experience && { experience: mappedInputs.experience }),
        },
      });

      const results = res.data.results || [];
      setCandidates(results);
      prepareCSV(results);
      saveToCache(cacheKey, results);
      setWarning("");
    } catch (err) {
      console.error(err);
      setWarning("Error fetching candidates.");
    }
  };

  useEffect(() => {
    const fetchCachedSearches = async () => {
      try {
        const res = await axios.get('http://localhost:8000/cached-searches');
        const validFilters = (res.data.filters || []).filter(
          f => f && (f.Skills || f.Location || f.Experience)
        );
        setCachedSearches(validFilters);
      } catch (err) {
        console.error("Failed to load cached searches", err);
      }
    };

    fetchCachedSearches();
  }, []);
          const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

    return (
        <>
            <Navbar show="logout" onLogout={handleLogout} /> {/* ✅ Navbar with logout */}
    <div className="container mt-5">
      <h2 className="mb-4">Search Candidates</h2>

      {warning && <div className="alert alert-warning">{warning}</div>}

      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Skills"
            name="skills"
            value={formInputs.skills}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Location"
            name="location"
            value={formInputs.location}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Experience (years)"
            name="experience"
            value={formInputs.experience}
            onChange={handleInputChange}
            step="0.1"
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            🔍 Search
          </button>
        </div>
      </div>

      {cachedSearches.length > 0 && (
        <div className="mb-4">
          <h6>Recent Searches:</h6>
          <div className="d-flex flex-wrap gap-2">
            {cachedSearches.map((filter, idx) => {
              const labelParts = [];

              if (filter.Skills && filter.Skills !== "Any") labelParts.push(`🧠 ${filter.Skills}`);
              if (filter.Location && filter.Location !== "Any") labelParts.push(`📍 ${filter.Location}`);
              if (filter.Experience && filter.Experience !== "Any") labelParts.push(`⏳ ${filter.Experience} yrs`);

              const label = labelParts.join(" | ") || "All";

              return (
                <button
                  key={idx}
                  className="btn btn-outline-primary rounded-pill px-3 py-1 small"
                  onClick={() => handleCachedSearchClick(filter)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {csvData.length > 0 && (
        <div className="mb-3 text-end">
          <CSVLink
            data={csvData}
            filename={`matched_candidates_job_${job_id}.csv`}
            className="btn btn-outline-primary"
          >
            📥 Download CSV
          </CSVLink>
        </div>
      )}

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c, idx) => (
            <tr key={idx}>
              <td>{c.person_name}</td>
              <td>{c.email}</td>
              <td>
                <a
                  href={c.cloudinary_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-success"
                >
                  View Resume
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {candidates.length === 0 && !warning && (
        <p className="text-muted">No candidates matched your search criteria.</p>
      )}
            </div>
            </>
  );
};

export default SearchPage;
