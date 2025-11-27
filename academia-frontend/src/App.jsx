import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StudentLogin from './components/StudentLogin';
import PlacementDashboard from './components/PlacementDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentLogin />} />
        <Route path="/dashboard" element={<PlacementDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
