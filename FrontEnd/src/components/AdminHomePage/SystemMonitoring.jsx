import React, { useState, useEffect } from "react";

const SystemMonitoring = () => {
  const [logEntries, setLogEntries] = useState([]);

  // Fetch logs from the Flask backend
  const fetchLogs = async () => {
    try {
      const response = await fetch("https://facialrecbackend.onrender.com/retrieve_logs");
      const data = await response.json();
      setLogEntries(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  // Fetch logs on component mount
  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">System Monitoring</h2>

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
              <td className="px-6 py-3 text-gray-800">{entry.logged_time}</td>
              <td className="px-6 py-3 text-gray-800">{entry.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={fetchLogs}
        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
      >
        Refresh Logs
      </button>
    </div>
  );
};

export default SystemMonitoring;
