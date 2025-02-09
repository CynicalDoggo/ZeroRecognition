import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GuestCheckIn = () => {
    const navigate = useNavigate();
    const [guests, setGuests] = useState([]);
    const [checkedInGuests, setCheckedInGuests] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchGuests();
    }, []);

    const fetchGuests = async () => {
        try {
            const response = await fetch("https://facialrecbackend.onrender.com/get_guest_bookings");
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            setGuests(data.pending);
            setCheckedInGuests(data.checkedIn);
        } catch (error) {
            console.error("Error fetching guest data:", error);
        }
    };
    

    const handleCheckIn = async (reservationId) => {
        try {
            navigate(`/facial-recognition?reservationId=${reservationId}`);
        } catch (error) {
            console.error("Error checking in guest:", error);
        }
    };

    const handleCheckOut = async (reservationId) => {
        try {
          const response = await fetch(
            `http://localhost:5000/check_out/${reservationId}`, 
            { method: "DELETE" }
          );
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
          }
      
          fetchGuests();
          alert("Guest checked out successfully!");
        } catch (error) {
          console.error("Check-out error:", error);
          alert(error.message || "Failed to check out guest");
        }
      };
    const filteredGuests = guests.filter((guest) =>
        guest.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-6">Guest Check-In</h2>
            
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search Guest"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            
            {/* Guests Pending Check-In */}
            <h3 className="text-xl font-semibold mb-4">Guests to Check-In Today</h3>
            <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <thead>
                    <tr className="bg-blue-500 text-white">
                        <th className="px-6 py-3 text-left">Guest Name</th>
                        <th className="px-6 py-3 text-left">Check-in Date</th>
                        <th className="px-6 py-3 text-left">Check-out Date</th>
                        <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredGuests.map((guest) => (
                        <tr key={guest.id} className="hover:bg-blue-50">
                            <td className="px-6 py-3 text-left">{guest.name}</td>
                            <td className="px-6 py-3 text-left">{guest.checkInDate}</td>
                            <td className="px-6 py-3 text-left">{guest.checkOutDate}</td>
                            <td className="px-6 py-3 text-left">
                                <button
                                    onClick={() => handleCheckIn(guest.id)}
                                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                                >
                                    Check-In
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Guests Already Checked-In */}
            <h3 className="text-xl font-semibold mb-4">Checked-In Guests</h3>
            <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-green-500 text-white">
                        <th className="px-6 py-3 text-left">Guest Name</th>
                        <th className="px-6 py-3 text-left">Check-in Date</th>
                        <th className="px-6 py-3 text-left">Check-out Date</th>
                        <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {checkedInGuests.map((guest) => (
                        <tr key={guest.id} className="hover:bg-green-50">
                            <td className="px-6 py-3 text-left">{guest.name}</td>
                            <td className="px-6 py-3 text-left">{guest.checkInDate}</td>
                            <td className="px-6 py-3 text-left">{guest.checkOutDate}</td>
                            <td className="px-6 py-3 text-left">
                                <button
                                    onClick={() => handleCheckOut(guest.id)}
                                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                >
                                    Check-Out
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GuestCheckIn;
