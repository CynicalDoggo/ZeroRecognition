import React, { useState } from "react";

const Blacklist = () => {
    const [blacklistedGuests, setBlacklistedGuests] = useState([
        { id: 1, guestName: "John Doe", reason: "Unpaid bills" },
        { id: 2, guestName: "Jane Smith", reason: "Property damage" },
    ]);

    const [newBlacklist, setNewBlacklist] = useState({
        guestName: "",
        reason: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBlacklist((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlacklist = () => {
        if (!newBlacklist.guestName || !newBlacklist.reason) {
            alert("Please fill in both fields.");
            return;
        }

        const newEntry = {
            id: blacklistedGuests.length + 1,
            guestName: newBlacklist.guestName,
            reason: newBlacklist.reason,
        };

        setBlacklistedGuests((prev) => [...prev, newEntry]);
        setNewBlacklist({ guestName: "", reason: "" });
        alert("Guest successfully blacklisted.");
    };

    return (
        <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-red-900 mb-6 text-center">Blacklisted Guests</h2>

            {/* Blacklist Table */}
            <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-red-500 text-white">
                        <th className="border border-gray-300 px-6 py-3 text-left">Guest Name</th>
                        <th className="border border-gray-300 px-6 py-3 text-left">Reason for Blacklist</th>
                    </tr>
                </thead>
                <tbody>
                    {blacklistedGuests.map((guest, index) => (
                        <tr key={guest.id} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-red-50`}>
                            <td className="border border-gray-300 px-6 py-3 text-left font-medium text-gray-800">{guest.guestName}</td>
                            <td className="border border-gray-300 px-6 py-3 text-left font-medium text-gray-800">{guest.reason}</td>
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
                        name="guestName"
                        placeholder="Guest Name"
                        value={newBlacklist.guestName}
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
