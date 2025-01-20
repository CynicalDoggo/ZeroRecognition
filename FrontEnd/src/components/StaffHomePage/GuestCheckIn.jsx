import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GuestCheckIn = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [guestsToCheckIn, setGuestsToCheckIn] = useState([
        { id: 1, name: "John Doe", checkInDate: "2025-01-15", checkOutDate: "2025-01-18" },
        { id: 2, name: "Jane Smith", checkInDate: "2025-01-15", checkOutDate: "2025-01-19" },
    ]);
    const [checkedInGuests, setCheckedInGuests] = useState([]);

    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredGuests = guestsToCheckIn.filter((guest) =>
        guest.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCheckIn = (guest) => {
        setCheckedInGuests((prev) => [...prev, guest]);
        setGuestsToCheckIn((prev) => prev.filter((g) => g.id !== guest.id));
        navigate("/FacialRecognition", { state: { guest } });
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Guest Check-In</h1>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search for a guest..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* Guests to Check In */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Guests to Check In</h2>
                <table className="w-full bg-white shadow-md rounded overflow-hidden">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-4 py-2 text-left">Guest Name</th>
                            <th className="px-4 py-2 text-left">Check-In Date</th>
                            <th className="px-4 py-2 text-left">Check-Out Date</th>
                            <th className="px-4 py-2 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGuests.length > 0 ? (
                            filteredGuests.map((guest) => (
                                <tr key={guest.id} className="hover:bg-gray-100">
                                    <td className="px-4 py-2 text-left">{guest.name}</td>
                                    <td className="px-4 py-2 text-left">{guest.checkInDate}</td>
                                    <td className="px-4 py-2 text-left">{guest.checkOutDate}</td>
                                    <td className="px-4 py-2 text-left">
                                        <button
                                            onClick={() => handleCheckIn(guest)}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        >
                                            Check-In
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                                    No guests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Checked-In Guests */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Checked-In Guests</h2>
                <table className="w-full bg-white shadow-md rounded overflow-hidden">
                    <thead className="bg-green-500 text-white">
                        <tr>
                            <th className="px-4 py-2 text-left">Guest Name</th>
                            <th className="px-4 py-2 text-left">Check-In Date</th>
                            <th className="px-4 py-2 text-left">Check-Out Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {checkedInGuests.length > 0 ? (
                            checkedInGuests.map((guest) => (
                                <tr key={guest.id} className="hover:bg-gray-100">
                                    <td className="px-4 py-2 text-left">{guest.name}</td>
                                    <td className="px-4 py-2 text-left">{guest.checkInDate}</td>
                                    <td className="px-4 py-2 text-left">{guest.checkOutDate}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                                    No guests checked in yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GuestCheckIn;
