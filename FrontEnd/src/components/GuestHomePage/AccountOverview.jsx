import React, { useState, useEffect } from "react";

const AccountOverview = () => {
  const [userData, setUserData] = useState({
    first_name: "",
    email: "",
    phone: "",
  });
  const [currentUser, setCurrentUser] = useState(null); // Declare currentUser state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = sessionStorage.getItem("user_id");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
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
        if (data.success) {
          setUserData(data.user_data);
        } else {
          throw new Error(data.message || "Unknown error");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCurrentUser = async () => {
      // Simulate fetching current user (use Supabase auth or other methods)
      const user = {
        id: userId,
        email: userData.email, // Use email from userData
      };
      setCurrentUser(user); // Set current user
    };

    fetchUserData();
    fetchCurrentUser();
  }, [userId, userData.email]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {/* <h2 className="text-2xl font-bold text-gray-800">Account Overview</h2> */}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{userData.first_name || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{userData.email || "N/A"}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{userData.mobile_number || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
