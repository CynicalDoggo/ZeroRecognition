import React, { useState, useEffect } from "react";

const AccountOverview = () => {
  const [userData, setUserData] = useState({
    first_name: "",
    email: "",
    mobile_number: "" ,
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ first_name: "", email: "", phone: "" });

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
          setFormData(data.user_data);
        } else {
          throw new Error(data.message || "Unknown error");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch("https://facialrecbackend.onrender.com/update_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, ...formData }),
      });
      if (!response.ok) {
        throw new Error("Failed to update user data");
      }
      const data = await response.json();
      if (data.success) {
        setUserData(formData);
        setIsEditing(false);
      } else {
        throw new Error(data.message || "Update failed");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
          <div className="flex items-center">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="border p-2 rounded mt-2"
                  />
                </>
              ) : (
                <p className="font-medium">
                  {`${userData.first_name || ""} ${userData.last_name || ""}`.trim() || "N/A"}
                </p>
              )}
            </div>
          </div>
            <div className="flex items-center">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border p-2 rounded"
                  />
                ) : (
                  <p className="font-medium">{userData.email || "N/A"}</p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    className="border p-2 rounded"
                  />
                ) : (
                  <p className="font-medium">{userData.mobile_number || "N/A"}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update Account Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
