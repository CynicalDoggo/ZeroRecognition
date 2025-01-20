import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Blacklist from "../components/StaffHomePage/Blacklist";
import GuestRoomStatus from "../components/StaffHomePage/GuestRoomStatus";
import GuestLog from "../components/StaffHomePage/GuestLog";
import GuestCheckIn from "../components/StaffHomePage/GuestCheckIn";

const StaffHomepage = ({ token }) => {
    let navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Guest Check In");

    function handleLogout() {
        sessionStorage.removeItem("token");
        navigate("/StaffLogin");
        window.location.reload();
    }

    const renderContent = () => {
        switch (activeTab) {
            case "Guest Check In":
                return <GuestCheckIn />;
            case "Guest Log":
                return <GuestLog />;
            case "Room Status":
                return <GuestRoomStatus />;
            case "Blacklist":
                return <Blacklist />;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <nav className="w-1/4 bg-gray-200 p-4 space-y-4">
                <h3 className="text-xl font-bold mb-4">Staff Panel</h3>
                {["Guest Check In","Guest Log", "Room Status", "Blacklist"].map((tab) => (
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
                    className="w-full text-left px-4 py-2 rounded bg-red-500 text-white mt-4"
                >
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

export default StaffHomepage;
