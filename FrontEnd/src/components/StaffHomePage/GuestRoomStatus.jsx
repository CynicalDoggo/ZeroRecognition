import React, { useState, useEffect } from "react";

const GuestRoomStatus = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/get-room-status")
            .then((response) => response.json())
            .then((data) => setRooms(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case "Occupied":
                return "bg-red-100 text-red-700";
            case "Vacant":
                return "bg-green-100 text-green-700";
            case "Cleaning":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-lg">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-blue-500 text-white">
                        <th className="px-6 py-3 text-left">Room ID</th>
                        <th className="px-6 py-3 text-left">Guest Name</th>
                        <th className="px-6 py-3 text-left">Check-out Date</th>
                        <th className="px-6 py-3 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room, index) => (
                        <tr key={room.id} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50`}>
                            <td className="px-6 py-3 text-left font-medium text-gray-800">{room.id}</td>
                            <td className="px-6 py-3 text-left font-medium text-gray-800">{room.guestName}</td>
                            <td className="px-6 py-3 text-left font-medium text-gray-800">{room.checkOutDate}</td>
                            <td className={`px-6 py-3 text-left font-medium rounded ${getStatusClass(room.status)}`}>{room.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GuestRoomStatus;
