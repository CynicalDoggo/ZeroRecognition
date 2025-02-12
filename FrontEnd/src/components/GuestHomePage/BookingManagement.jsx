import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BookingManagement = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null); // Track selected booking
    const [newCheckIn, setNewCheckIn] = useState("");
    const [newCheckOut, setNewCheckOut] = useState("");

    // Fetch bookings from backend
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch("https://facialrecbackend.onrender.com/get_guest_bookingsGUEST"); 
                const data = await response.json();
                setBookings(data); 
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

    // Open modify booking form
    const handleModify = (booking) => {
        setSelectedBooking(booking);
        setNewCheckIn(booking.checkInDate);
        setNewCheckOut(booking.checkOutDate);
    };

    const handleUpdateBooking = async () => {
        if (!selectedBooking) return;
        
        try {
            const response = await fetch(`https://facialrecbackend.onrender.com/edit_booking/${selectedBooking.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    check_in_date: newCheckIn, 
                    check_out_date: newCheckOut  
                }),
            });
    
            const result = await response.json();
            
            if (!response.ok) {
                alert(result.message || "Update failed");
                return;
            }
    
            // Update local state
            setBookings(bookings.map(b => 
                b.id === selectedBooking.id 
                    ? { ...b, 
                        checkInDate: newCheckIn,
                        checkOutDate: newCheckOut
                      } 
                    : b
            ));
            setSelectedBooking(null);
            alert("Booking updated successfully!");
            
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to connect to server");
        }
    };
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Your Bookings</h2>
                <button onClick={() => navigate("/booking-form")} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    New Booking
                </button>
            </div>

            {bookings.length > 0 ? (
                bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 space-y-4">
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm text-gray-600">Room Type</p>
                                <p className="font-medium">{booking.roomType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Check-in</p>
                                <p className="font-medium">{new Date(booking.checkInDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Check-out</p>
                                <p className="font-medium">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <button onClick={() => handleModify(booking)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                                Modify Booking
                            </button>
                            <button onClick={() => handleCancelation(booking.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                Cancel Booking
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No bookings found.</p>
            )}

            {/* Modify Booking Form */}
            {selectedBooking && (
                <div className="bg-gray-100 p-6 rounded shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Modify Booking</h3>
                    <div className="space-y-4">
                        <input
                            type="date"
                            value={newCheckIn}
                            onChange={(e) => setNewCheckIn(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            min={today}  // ⬅️ Prevents past dates
                        />
                        <input
                            type="date"
                            value={newCheckOut}
                            onChange={(e) => setNewCheckOut(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded"
                            min={newCheckIn || today}  // ⬅️ Prevents past dates & ensures check-out is after check-in
                        />
                        <button onClick={handleUpdateBooking} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            Save Changes
                        </button>
                        <button onClick={() => setSelectedBooking(null)} className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManagement;
