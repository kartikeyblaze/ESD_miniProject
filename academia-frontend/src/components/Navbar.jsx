import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [student, setStudent] = useState(null);

  // Fetch student details for the popup
  useEffect(() => {
    const fetchProfile = async () => {
      const studentId = localStorage.getItem('loggedStudentId');
      const token = localStorage.getItem('jwt_token');
      if (studentId && token) {
        try {
          const response = await axios.get(`http://localhost:8080/api/student/${studentId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setStudent(response.data);
        } catch (err) {
          console.error("Failed to fetch profile", err);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    // Clear Session
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('loggedStudentId');
    // Redirect to Login
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>🎓 Academia ERP</div>

      <div style={styles.rightSection}>
        {/* Avatar */}
        <div style={styles.avatarContainer} onClick={() => setShowProfile(!showProfile)}>
          <div style={styles.avatar}>
            {student ? student.firstName.charAt(0) : 'U'}
          </div>
          {/* Profile Popup */}
          {showProfile && student && (
            <div style={styles.popup}>
              <h4 style={{margin: '0 0 10px 0'}}>{student.firstName} {student.lastName}</h4>
              <p style={styles.popupText}><strong>ID:</strong> {student.rollNumber}</p>
              <p style={styles.popupText}><strong>Email:</strong> {student.email}</p>
              <p style={styles.popupText}><strong>Domain:</strong> {student.domain}</p>
              <p style={styles.popupText}><strong>CGPA:</strong> {student.cgpa}</p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    // Dark Coffee Background
    backgroundColor: '#4a4036',
    color: '#fdfbf7', // Cream Text
    boxShadow: '0 2px 10px rgba(74, 64, 54, 0.15)'
  },
  logo: {
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    color: '#fdfbf7'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    position: 'relative'
  },
  avatarContainer: {
    cursor: 'pointer',
    position: 'relative'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    // Soft Beige Avatar
    backgroundColor: '#e6e2d3',
    color: '#4a4036',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    border: '2px solid #fdfbf7'
  },
  logoutBtn: {
    padding: '8px 18px',
    // Muted Red/Terracotta
    backgroundColor: '#bc5646',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  popup: {
    position: 'absolute',
    top: '55px',
    right: '0',
    width: '220px',
    backgroundColor: '#ffffff',
    color: '#4a4036',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    zIndex: 1000,
    border: '1px solid #e6e2d3'
  },
  popupText: {
    margin: '8px 0',
    fontSize: '14px',
    color: '#5c554b'
  }
};

export default Navbar;
