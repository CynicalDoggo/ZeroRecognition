import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FacialRegistration from "../../Pages/FacialRegistration";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://jbqkrihvwaurorcdagiw.supabase.co", 
                              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpicWtyaWh2d2F1cm9yY2RhZ2l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NzQ2ODUsImV4cCI6MjA0NTU1MDY4NX0.YKPc7TvBowLYKWVohA_5dsl9IfFMz7qr1fo4f7V3cY8"); // Use anon key

const GuestSettings = () => {
  const [showFacialRegistration, setShowFacialRegistration] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    enableNotifications: false,
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) throw new Error("User ID is missing");

        const response = await fetch(
          `https://facialrecbackend.onrender.com/get_user_data?user_id=${userId}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        if (data.success) setUserData(data.user_data);
        else throw new Error(data.message || "Unknown error");
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

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
      // **Step 1: Verify Current Password by Signing In**
      const { data: authUser, error: authError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: passwords.currentPassword, // Verifying current password
      });
  
      if (authError) {
        alert("Invalid current password!");
        return;
      }

      const response = await fetch("https://facialrecbackend.onrender.com/change_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userData.user_id,
          new_password: passwords.newPassword,
        }),
      });
  
      const result = await response.json();
      
      if (response.ok) {
        alert("Password updated successfully!");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        navigate("/Homepage");
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("An error occurred while updating the password. Please try again.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-white p-6 shadow rounded space-y-6">
      {/* Change Password */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Change Password</h3>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <input type="password" name="currentPassword" placeholder="Current Password" className="w-full px-4 py-2 border border-gray-300 rounded" value={passwords.currentPassword} onChange={handlePasswordChange} />
          <input type="password" name="newPassword" placeholder="New Password" className="w-full px-4 py-2 border border-gray-300 rounded" value={passwords.newPassword} onChange={handlePasswordChange} />
          <input type="password" name="confirmPassword" placeholder="Confirm New Password" className="w-full px-4 py-2 border border-gray-300 rounded" value={passwords.confirmPassword} onChange={handlePasswordChange} />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update Password</button>
        </form>
      </div>

      {/* Facial Recognition */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Facial Recognition</h3>
        <button onClick={() => setShowFacialRegistration(true)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Upload Facial Data</button>

        {showFacialRegistration && (
          <div className="mt-4 p-4 border border-gray-300 rounded-lg flex flex-col items-center justify-center">
            <FacialRegistration />
            <button onClick={() => setShowFacialRegistration(false)} className="mt-4 px-6 py-2 bg-red-600 text-white font-bold rounded">Close Webcam</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestSettings;
