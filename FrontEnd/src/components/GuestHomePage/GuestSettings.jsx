import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FacialRegistration from "../../Pages/FacialRegistration";

const GuestSettings = () => {
  const [enableFacialRecognition, setEnableFacialRecognition] = useState(false);
  const [showFacialRegistration, setShowFacialRegistration] = useState(false);
  const [userData, setUserData] = useState(null); // Hold user data
  const [isLoading, setIsLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    enableNotifications: false,
    enableFacialRecognition: false,
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const navigate = useNavigate();

  const handleFacialRecognitionChange = (e) => {
    const isChecked = e.target.checked;
    setEnableFacialRecognition(isChecked);
    
    if (!isChecked) {
      setShowFacialRegistration(false); // Hide webcam when disabled
    }
  };

  // Fetch the logged-in user's data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem("user_id");

        if (!userId) {
          throw new Error("User ID is missing");
        }

        console.log("User ID:", userId); // Debugging log

        const response = await fetch(
          `https://facialrecbackend.onrender.com/get_user_data?user_id=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        console.log("Fetched data:", data); // Debugging log

        if (data.success) {
          setUserData(data.user_data);
        } else {
          throw new Error(data.message || "Unknown error");
        }
      } catch (err) {
        console.error("Error:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false); // Ensure loading state is updated
      }
    };

    fetchUserData();
  }, []);

  const handleSettingsChange = (event) => {
    const { name, checked } = event.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!userData?.user_id) {
      alert("User ID is missing.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const response = await fetch("https://facialrecbackend.onrender.com/change_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userData.user_id, // Use fetched user ID
          email: userData.email, // Use fetched email
          current_password: passwords.currentPassword,
          new_password: passwords.newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Password updated successfully!");
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        navigate("/Homepage"); // Redirect after successful password change
      } else {
        alert(result.message); // Show backend error message
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("An error occurred while updating the password. Please try again.");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>; // Show a loading state while fetching user data
  }

  if (error) {
    return <p>Error: {error}</p>; // Show error if fetching user data fails
  }

  return (
    <div className="bg-white p-6 shadow rounded space-y-6">
      {/* Change Password */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Change Password</h3>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              className="w-full px-4 py-2 border border-gray-300 rounded"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              className="w-full px-4 py-2 border border-gray-300 rounded"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              className="w-full px-4 py-2 border border-gray-300 rounded"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Facial Recognition */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Facial Recognition</h3>
        <label className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            checked={enableFacialRecognition}
            onChange={handleFacialRecognitionChange}
            className="w-4 h-4"
          />
          <span>
            Enable facial recognition for check-in
          </span>
        </label>

        {/* Upload Facial Data Button */}
        {enableFacialRecognition && !showFacialRegistration && (
            <button
                onClick={() => setShowFacialRegistration(true)} // Show webcam when clicked
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
                Upload Facial Data
            </button>
        )}

        {/* Show Webcam (FacialRegistration) Only When Needed */}
        {showFacialRegistration && (
          <div className="mt-4 p-4 border border-gray-300 rounded-lg flex flex-col items-center justify-center">
            <FacialRegistration />
            <button
              onClick={() => setShowFacialRegistration(false)} // Hide webcam when clicked
              className="mt-4 px-6 py-2 bg-red-600 text-white font-bold rounded"
            >
              Close Webcam
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestSettings;
