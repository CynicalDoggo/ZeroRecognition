import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BookingManagement = () => {
    const navigate = useNavigate();

    // Example bookings data, change to dynamic can alr
    const [bookings, setBookings] = useState([
        { id: 1, roomType: "Deluxe Suite", checkIn: "2024-12-25", checkOut: "2024-12-30" },
        { id: 2, roomType: "Standard Room", checkIn: "2024-12-20", checkOut: "2024-12-27" },
    ]);

    const handleCancelation = (id) => {
        alert(`Cancel booking for ID: ${id}`);
        // Should just delete straight upon clicking
    };

    const handleNewBooking = () => {
        navigate("/booking-form"); // Navigate to the BookingForm page
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Your Bookings</h2>
                <button
                    onClick={handleNewBooking}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    New Booking
                </button>
            </div>

            {/* Bookings List */}
            {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-6">
                        {/* Room Type */}
                        <div>
                            <p className="text-sm text-gray-600">Room Type</p>
                            <p className="font-medium">{booking.roomType}</p>
                        </div>

                        {/* Booking Dates */}
                        <div>
                            <p className="text-sm text-gray-600">Check-in</p>
                            <p className="font-medium">{booking.checkIn}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Check-out</p>
                            <p className="font-medium">{booking.checkOut}</p>
                        </div>
                    </div>
                    {/* Modify Booking */}
                    <button
                        onClick={() => handleCancelation(booking.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Cancel Booking
                    </button>
                </div>
            ))}
        </div>
    );
};

export default BookingManagement;
