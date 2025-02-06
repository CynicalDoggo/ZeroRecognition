import React, { useState, useEffect } from "react";

const Blacklist = () => {
    const [blacklistedGuests, setBlacklistedGuests] = useState([]);
    const [newBlacklist, setNewBlacklist] = useState({
        guestEmail: "",
        reason: "",
    });

    // Fetch blacklisted guests when the component mounts
    useEffect(() => {
        const fetchBlacklistedGuests = async () => {
            const token = sessionStorage.getItem("token");
            if (!token) {
                alert("User not authenticated. Please log in again.");
                return;
            }

            try {
                const response = await fetch("https://facialrecbackend.onrender.com/get_blacklisted_guests", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setBlacklistedGuests(data.blacklistedGuests); // Assuming the response returns an array of blacklisted guests
                } else {
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                alert(`Failed to fetch blacklisted guests: ${error.message}`);
            }
        };

        fetchBlacklistedGuests();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBlacklist((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlacklist = async () => {
        if (!newBlacklist.guestEmail || !newBlacklist.reason) {
            alert("Please fill in both fields.");
            return;
        }

        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("User not authenticated. Please log in again.");
            return;
        }

        try {
            const response = await fetch("https://facialrecbackend.onrender.com/blacklist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    email: newBlacklist.guestEmail, // Assuming guestEmail corresponds to email
                    reason: newBlacklist.reason,
                }),
            });

            console.log("Token being sent:", token); // Debugging to ensure token is retrieved

            const data = await response.json();

            if (response.ok) {
                setBlacklistedGuests((prev) => [
                    ...prev,
                    {
                        id: prev.length + 1,
                        guestEmail: newBlacklist.guestEmail,
                        reason: newBlacklist.reason,
                    },
                ]);
                setNewBlacklist({ guestEmail: "", reason: "" });
                alert("Guest successfully blacklisted.");
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            alert(`Failed to blacklist guest: ${error.message}`);
        }
    };

    return (
        <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-red-900 mb-6 text-center">Blacklisted Guests</h2>

            {/* Blacklist Table */}
            <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-red-500 text-white">
                        <th className="px-6 py-3 text-left">Guest Name</th>
                        <th className="px-6 py-3 text-left">Reason for Blacklist</th>
                    </tr>
                </thead>
                <tbody>
                    {blacklistedGuests.map((guest, index) => (
                        <tr key={guest.id} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-red-50`}>
                            <td className="px-6 py-3 text-left font-medium text-gray-800">{guest.guestEmail}</td>
                            <td className="px-6 py-3 text-left font-medium text-gray-800">{guest.reason}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add to Blacklist Form */}
            <div className="mt-6 bg-white p-4 rounded-md shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add to Blacklist</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="guestEmail"
                        placeholder="Guest Email"
                        value={newBlacklist.guestEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    <input
                        type="text"
                        name="reason"
                        placeholder="Reason for Blacklist"
                        value={newBlacklist.reason}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    <button
                        onClick={handleBlacklist}
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-300"
                    >
                        Blacklist Guest
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Blacklist;
