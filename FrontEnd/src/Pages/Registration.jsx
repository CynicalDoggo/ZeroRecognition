import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseclient';
import FacialRegistration from './FacialRegistration';

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNum: '',
    password: '',
    confirmPassword: '',
  });

  const [facialRecognitionOptIn, setFacialRecognitionOptIn] = useState(false);
  const [privacyAndConsentChecked, setPrivacyAndConsentChecked] = useState(false); //Set P&C default as false
  const [showModal, setShowModal] = useState(false); //Set P&C text modal showing default as false 
  const [faceData, setFaceData] = useState(null); // State to store captured facial data


  function handleChange(event) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }

  function handleFacialRecognitionChange(event) {
    setFacialRecognitionOptIn(event.target.checked);
  }

  function handlePrivacyAndConsentChange(event) {
    setPrivacyAndConsentChecked(event.target.checked);
  }

  const handleFacialDataCapture = (capturedData) => {
    setFaceData(capturedData); // Store captured facial data in state
    console.log("Facial data captured successfully!: ", capturedData);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!privacyAndConsentChecked) {
      alert("Please review our Privacy and Consent before proceeding");
      return;
    }

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNum: formData.phoneNum,
        email: formData.email,
        password: formData.password,
        facialRecognitionOptIn: facialRecognitionOptIn,
        faceData: facialRecognitionOptIn ? faceData : null // Insert facedata only if user opts in
      };

      const response = await fetch("https://facialrecbackend.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        alert("Registration successful! Please check your email for verification.");
      } else {
        alert(`Registration failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error);
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-md shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Registration</h1>

        <div className="mb-4">
          <input
            placeholder="First Name"
            name="firstName"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <input
            placeholder="Last Name"
            name="lastName"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <input
            placeholder="Email"
            name="email"
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <input
            placeholder="Phone Number"
            name="phoneNum"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <input
            placeholder="Password"
            name="password"
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={privacyAndConsentChecked}
              onChange={handlePrivacyAndConsentChange}
            />
            <span>
              I have read and agree to the{" "}
              <span
                className="text-blue-500 underline hover:text-blue-700 cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                Privacy and Consent terms
              </span>.
            </span>
          </label>
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={facialRecognitionOptIn}
              onChange={handleFacialRecognitionChange}
            />
            <span>Opt-in for Facial Recognition</span>
          </label>
        </div>

        {/* Render FacialRegistration if opted in */}
        {facialRecognitionOptIn && (
          <FacialRegistration onCapture={handleFacialDataCapture} />
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Register
        </button>
      </form>

      {/* Privacy and Consent Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full h-3/4 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Privacy and Consent for Facial Recognition Data Usage</h2>
            
            <div className="text-sm text-gray-700 space-y-4">
              <p><strong>1. Introduction</strong></p>
              <p>1.1 Welcome to Our Hotel. By agreeing to these Terms and Conditions, you consent to the collection, storage, and processing of your facial recognition data for use in our automated check-in, check-out, and service systems.</p>
              <p>1.2 Please read the following terms carefully before providing your consent. These terms establish the legal framework under which your facial recognition data will be handled.</p>
              
              <p><strong>2. Definitions</strong></p>
              <p>2.1 "Facial Recognition Data" refers to biometric data derived from facial features for identity verification purposes.</p>
              <p>2.2 "System" refers to the facial recognition software and associated infrastructure used by Our Hotel.</p>
              
              <p><strong>3. Purpose of Data Collection</strong></p>
              <ul className="list-disc ml-5">
                <li>Streamlining the check-in and check-out processes.</li>
                <li>Providing secure access to rooms and hotel amenities.</li>
                <li>Enhancing service personalization and overall security measures.</li>
              </ul>

              <p><strong>4. Data Collection and Processing</strong></p>
              <p>4.1 Facial data will be collected using devices integrated with our System, adhering to privacy regulations. The data will be encrypted (AES-256) and stored securely.</p>

              <p><strong>5. Consent</strong></p>
              <p>5.1 By providing your data, you consent to its collection and use as stated in this document. You can withdraw consent at any time by contacting support.</p>
              
              <p><strong>6. Security Measures</strong></p>
              <p>We implement robust security measures, including encryption and restricted access, to safeguard your data.</p>

              <p><strong>7. Contact Us</strong></p>
              <p>For queries, please contact us via support@ourhotel.com or call +65 8395 3020.</p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;
