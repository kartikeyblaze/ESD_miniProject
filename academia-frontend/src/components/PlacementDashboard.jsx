import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const PlacementDashboard = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [existingCv, setExistingCv] = useState(null);

  useEffect(() => {
    const studentId = localStorage.getItem('loggedStudentId');
    const token = localStorage.getItem('jwt_token');

    if (!studentId) {
      setError('No student logged in.');
      setLoading(false);
      return;
    }

    const authHeader = { headers: { 'Authorization': `Bearer ${token}` } };

    Promise.all([
        axios.get(`http://localhost:8080/api/placement/eligible/${studentId}`, authHeader),
        axios.get(`http://localhost:8080/api/student/${studentId}`, authHeader)
    ])
    .then(([offersResponse, studentResponse]) => {
        if (Array.isArray(offersResponse.data)) {
            setOffers(offersResponse.data);
        }
        const studentData = studentResponse.data;
        if (studentData.cvFilePath) {
            const filename = studentData.cvFilePath.split('/').pop().split('\\').pop();
            setExistingCv(filename);
        }
        setLoading(false);
    })
    .catch(err => {
        console.error("Error loading dashboard:", err);
        setError('Failed to load dashboard data.');
        setLoading(false);
    });
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    const studentId = localStorage.getItem('loggedStudentId');
    const token = localStorage.getItem('jwt_token');
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploadStatus("Uploading...");
      await axios.post(`http://localhost:8080/api/student/${studentId}/upload-cv`, formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus("CV Uploaded Successfully!");
      setExistingCv(selectedFile.name);
      setSelectedFile(null);
    } catch (error) {
      setUploadStatus("Upload Failed. Try again.");
    }
  };

  const downloadCv = async () => {
    const studentId = localStorage.getItem('loggedStudentId');
    const token = localStorage.getItem('jwt_token');
    try {
      const response = await axios.get(`http://localhost:8080/api/student/${studentId}/cv`, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', existingCv);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download CV.");
    }
  };

  const handleApply = async (offerId) => {
    const studentId = localStorage.getItem('loggedStudentId');
    const token = localStorage.getItem('jwt_token');
    try {
      await axios.post('http://localhost:8080/api/placement/apply',
        { studentId: Number(studentId), offerId: Number(offerId) },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert("Application Submitted Successfully!");
    } catch (err) {
      alert(err.response?.data || "Application Failed");
    }
  };

  if (loading) return <div style={{padding:'40px', textAlign:'center', color:'#5c554b'}}>Loading dashboard...</div>;
  if (error) return <div style={{padding:'40px', textAlign:'center', color:'#c53030'}}>{error}</div>;

  return (
    <div style={{ backgroundColor: '#fdfbf7', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>

        {/* CV SECTION */}
        <div style={styles.sectionCard}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
            <h3 style={styles.cardTitle}>
                {existingCv ? "Your Resume" : "Upload Resume"}
            </h3>
            {existingCv && <span style={styles.verifiedBadge}>✔ Verified</span>}
          </div>

          {existingCv && (
              <div style={styles.cvPreviewBox}>
                  <span style={{ fontSize:'20px', marginRight:'10px' }}>📄</span>
                  <button onClick={downloadCv} style={styles.linkButton}>
                      {existingCv}
                  </button>
              </div>
          )}

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop:'20px' }}>
              <input type="file" accept=".pdf" onChange={handleFileChange} style={styles.fileInput} />
              <button onClick={handleUpload} style={styles.uploadButton}>
                {existingCv ? "Update PDF" : "Upload PDF"}
              </button>
          </div>
          {uploadStatus && <p style={{ marginTop:'10px', fontSize:'14px', color: uploadStatus.includes("Failed") ? '#c53030' : '#2f855a' }}>{uploadStatus}</p>}
        </div>

        {/* JOB OFFERS SECTION */}
        <h2 style={{ color: '#4a4036', marginTop: '40px', marginBottom: '20px', fontSize:'24px' }}>Eligible Opportunities</h2>

        {offers && offers.length > 0 ? (
          <div style={{ display: 'grid', gap: '20px' }}>
            {offers.map(offer => (
              <div key={offer.id} style={styles.offerCard}>
                <div>
                    <h3 style={{ margin: '0 0 5px 0', color: '#2c241b', fontSize:'18px' }}>{offer.organizationName}</h3>
                    <p style={{ margin: '0', color: '#5c554b', fontWeight:'500' }}>{offer.role}</p>
                    <p style={{ margin: '5px 0 0', color: '#8c857b', fontSize:'14px' }}>Min CGPA: {offer.minCgpa}</p>
                </div>

                <div style={{ display:'flex', alignItems:'center', gap:'15px' }}>
                    {!existingCv && <span style={{color:'#bc5646', fontSize:'13px', fontWeight:'500'}}>Upload CV to Apply</span>}
                    <button
                      onClick={() => handleApply(offer.id)}
                      disabled={!existingCv}
                      style={existingCv ? styles.applyButton : styles.disabledButton}
                    >
                      Apply Now
                    </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#8c857b', textAlign:'center', marginTop:'40px' }}>No eligible offers found based on your profile.</p>
        )}
      </div>
    </div>
  );
};

// --- DASHBOARD STYLES ---
const styles = {
  sectionCard: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(92, 85, 75, 0.08)',
    border: '1px solid #e6e2d3'
  },
  cardTitle: {
    margin: 0,
    color: '#4a4036',
    fontSize: '20px'
  },
  verifiedBadge: {
    backgroundColor: '#e6fffa',
    color: '#2f855a',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid #b2f5ea'
  },
  cvPreviewBox: {
    backgroundColor: '#faf9f6',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e2e0d6',
    display: 'flex',
    alignItems: 'center'
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#4a4036',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px'
  },
  fileInput: {
    fontSize: '14px',
    color: '#5c554b'
  },
  uploadButton: {
    padding: '10px 20px',
    backgroundColor: '#8c857b', // Muted Taupe
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background 0.2s',
  },
  offerCard: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '10px',
    border: '1px solid #e6e2d3',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    transition: 'transform 0.2s'
  },
  applyButton: {
    backgroundColor: '#5d8a68', // Sage Green
    color: 'white',
    padding: '10px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 2px 5px rgba(93, 138, 104, 0.3)'
  },
  disabledButton: {
    backgroundColor: '#e2e0d6',
    color: '#a8a29e',
    padding: '10px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'not-allowed',
    fontWeight: '600'
  }
};

export default PlacementDashboard;
