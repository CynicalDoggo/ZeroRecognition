import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BookingManagement = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

    // Fetch bookings from backend
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch("https://facialrecbackend.onrender.com/get_guest_bookingsGUEST"); 
                const data = await response.json();
                setBookings(data); // Set fetched bookings into state
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, []);

    // Cancel booking function
    const handleCancelation = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            const response = await fetch(`https://facialrecbackend.onrender.com/cancel_booking/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));
                alert("Booking canceled successfully!");
            } else {
                alert("Failed to cancel booking");
            }
        } catch (error) {
            console.error("Error canceling booking:", error);
            alert("An error occurred while canceling the booking.");
        }
    };

    // Navigate to the booking form
    const handleNewBooking = () => {
        navigate("/booking-form");
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
            {bookings.length > 0 ? (
            bookings.map((booking) => ( // Changed from 'bookings' to 'booking'
                <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div className="grid grid-cols-3 gap-6">
                    <div>
                    <p className="text-sm text-gray-600">Room Type</p>
                    <p className="font-medium">{booking.roomType}</p>
                    </div>
                    <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium">
                        {new Date(booking.checkInDate).toLocaleDateString()}
                    </p>
                    </div>
                    <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium">
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                    </div>
                </div>
                <button
                    onClick={() => handleCancelation(booking.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Cancel Booking
                </button>
                </div>
                ))
            ) : (
            <p>No bookings found.</p>
            )}
        </div>
    );
};

export default BookingManagement;
