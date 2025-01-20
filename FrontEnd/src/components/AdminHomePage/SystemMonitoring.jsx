import React, { useState } from "react";

const SystemMonitoring = () => {
  const [logEntries, setLogEntries] = useState([
    { id: 1, timestamp: "2025-01-01 10:15:00", activity: "Failed login attempt by Guest 001" },
    { id: 2, timestamp: "2025-01-02 14:45:00", activity: "Password updated by Guest 002" },
    { id: 3, timestamp: "2025-01-03 09:30:00", activity: "Failed login attempt by Guest 003" },
  ]);

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">System Monitoring</h2>

      {/* Monitoring Log Table */}
      <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-6 py-3 text-left">Timestamp</th>
            <th className="px-6 py-3 text-left">Activity</th>
          </tr>
        </thead>
        <tbody>
          {logEntries.map((entry) => (
            <tr key={entry.id} className="hover:bg-blue-50">
              <td className="px-6 py-3 text-gray-800">{entry.timestamp}</td>
              <td className="px-6 py-3 text-gray-800">{entry.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add New Entry (Simulated for Demonstration) */}
      <button
        onClick={() =>
          setLogEntries((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
              activity: "Simulated activity for testing",
            },
          ])
        }
        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
      >
        Simulate Activity
      </button>
    </div>
  );
};

export default SystemMonitoring;
