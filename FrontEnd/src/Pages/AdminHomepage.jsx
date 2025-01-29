import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserManagement from "../components/AdminHomePage/UserManagement";
import SystemMonitoring from "../components/AdminHomePage/SystemMonitoring";

const AdminHomepage = ({ token }) => {
    let navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("User Management");

    useEffect(() => {
        const storedToken = sessionStorage.getItem("token");
        if (!storedToken) {
            // If no token is found, redirect to login page
            navigate("/");
        }
    }, [navigate]);

    function handleLogout() {
        sessionStorage.removeItem("token");
        navigate("/AdminLogin");
        window.location.reload();
    }

    const renderContent = () => {
        switch (activeTab) {
            case "User Management":
                return <UserManagement />;
            case "System Monitoring":
                return <SystemMonitoring />;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <nav className="w-1/4 bg-gray-200 p-4 space-y-4">
                <h3 className="text-xl font-bold mb-4">Admin Panel</h3>
                {["User Management", "System Monitoring"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full text-left px-4 py-2 rounded ${
                            activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-2 rounded bg-red-500 text-white mt-4 hover:bg-red-600 transition duration-300">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        fill="currentColor" 
                        className="bi bi-box-arrow-right mr-2" 
                        viewBox="0 0 16 16"
                    >
                        <path 
                        fillRule="evenodd" 
                        d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                        />
                        <path 
                        fillRule="evenodd" 
                        d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                        />
                    </svg>
                    Logout
                </button>
            </nav>

            {/* Main Content */}
            <div className="w-3/4 p-6">
                <h2 className="text-2xl font-bold mb-4">{activeTab}</h2>
                <div>{renderContent()}</div>
            </div>
        </div>
    );
};

export default AdminHomepage;
