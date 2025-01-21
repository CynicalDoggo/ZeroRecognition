import React, { useState } from "react";

const GuestLog = () => {
    const [logEntries, setLogEntries] = useState([
        { id: 1, guestName: "John Doe", timestamp: "2024-12-01 14:00", activity: "Check-In" },
        { id: 2, guestName: "Jane Smith", timestamp: "2024-12-02 10:30", activity: "Check-Out" },
        { id: 3, guestName: "Emily Davis", timestamp: "2024-12-02 15:00", activity: "Check-In" },
    ]);

    return (
        <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">Guest Activity Log</h2>

            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-green-500 text-white">
                        <th className="px-6 py-3 text-left">Guest Name</th>
                        <th className="px-6 py-3 text-left">Timestamp</th>
                        <th className="px-6 py-3 text-left">Activity</th>
                    </tr>
                </thead>
                <tbody>
                    {logEntries.map((entry, index) => (
                        <tr key={entry.id} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-50`}>
                            <td className="px-6 py-3 text-left font-medium text-gray-800">{entry.guestName}</td>
                            <td className="px-6 py-3 text-left font-medium text-gray-800">{entry.timestamp}</td>
                            <td className="px-6 py-3 text-left font-medium text-gray-800">{entry.activity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GuestLog;
