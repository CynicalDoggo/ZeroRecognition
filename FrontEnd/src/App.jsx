import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Registration from './Pages/Registration';
import Login from './Pages/Login';
import Homepage from './Pages/Homepage';
import FacialRegistration from './Pages/FacialRegistration';
import StaffLogin from './Pages/StaffLogin';
import AdminLogin from './Pages/AdminLogin';
import BookingForm from './components/GuestHomePage/BookingForm';
import StaffHomepage from './Pages/StaffHomepage';
import AdminHomepage from './Pages/AdminHomepage';


const App = () => {
  const [token, setToken] = useState(false);

  // Save token to session storage if available
  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', JSON.stringify(token));
    }
  }, [token]);

  // Load token from session storage on page load
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      setToken(JSON.parse(storedToken));
    }
  }, []);

  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/StaffHomepage" element={<StaffHomepage token={token}/>} />
        <Route path="/AdminHomepage" element={<AdminHomepage token={token}/>} />
        <Route path="/StaffLogin" element={<StaffLogin setToken={setToken}/>} />
        <Route path="/AdminLogin" element={<AdminLogin setToken={setToken}/>} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/booking" element={<div>Booking Page (Add Booking Form Here)</div>} /> {/* Placeholder */}

        {/* Protected Routes - Only accessible when the user is logged in */}
        {token ? (
          <>
            <Route path="/Homepage" element={<Homepage token={token} />} />
            <Route path="/facial-registration" element={<FacialRegistration />} />
            <Route path="/booking-form" element={<BookingForm />} />
          </>
        ) : (
          // Redirect to Login if not authenticated
          <Route path="*" element={<div>Please log in to access this page.</div>} />
        )}
      </Routes>
    </div>
  );
};

export default App;
