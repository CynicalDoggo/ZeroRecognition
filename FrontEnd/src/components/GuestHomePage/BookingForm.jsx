import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {
  const navigate = useNavigate(); // Initialize navigate
  // State for booking form fields
  const [formData, setFormData] = useState({
    roomType: '',
    checkInDate: '',
    checkOutDate: '',
    ExtraTowels: false,
    RoomService: false,
    SpaAccess: false,
    AirportPickup: false,
    LateCheckout: false,
  });

  const [bookingStatus, setBookingStatus] = useState(null);

  // List of available amenities
  const amenitiesList = [
    { id: 1, name: 'Extra Towels' },
    { id: 2, name: 'Room Service' },
    { id: 3, name: 'Spa Access' },
    { id: 4, name: 'Airport Pickup' },
    { id: 5, name: 'Late Checkout' }
  ];

  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle selecting amenities
  const handleAmenitiesChange = (e) => {
    const name = e.target.name; // Use the name attribute
    const isChecked = e.target.checked; // Checkbox state
    setFormData((prev) => ({
      ...prev,
      [name]: isChecked, // Update the boolean value
    }));
  };

  const handleSaveChanges = async () => {
    const { roomType, checkInDate, checkOutDate, ...amenities } = formData;
  
    if (!roomType || !checkInDate || !checkOutDate) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const userId = sessionStorage.getItem("user_id");
  
      const payload = {
        user_id: userId,
        room_type: roomType,
        check_in_date: new Date(checkInDate).toISOString(),
        check_out_date: new Date(checkOutDate).toISOString(),
        ...amenities, // Include amenities dynamically
      };

      const response = await fetch("http://localhost:5000/book_room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        setBookingStatus(data.message); // Set the success message
        setTimeout(() => {
          navigate("/Homepage"); // Navigate after a short delay to allow the user to read the message
        }, 2000); // Delay of 2 seconds
      } else {
        setBookingStatus(data.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during booking:", error);
      setBookingStatus("An error occurred. Please try again.");
    }
  };

  const handleCancelBooking = () => {
    setFormData({
      roomType: '',
      checkInDate: '',
      checkOutDate: '',
      ExtraTowels: false,
      RoomService: false,
      SpaAccess: false,
      AirportPickup: false,
      LateCheckout: false,
    });
    navigate("/Homepage");
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center">Room Booking</h2>

      {/* Personal Information */}

      <div className='my-4'>
        <label htmlFor='room-type' className="block text-sm">Room Type</label>
        <select
            id="room-type"
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
        >
            <option value="">Select Room Type</option>
            <option value="Single Room">Single Room</option>
            <option value="Twin Room">Twin Room</option>
            <option value="Double Room">Double Room</option>
            <option value="Deluxe Double Room">Deluxe Double Room</option>
        </select>
      </div>


      {/* Booking Dates */}
      <div className="my-4">
        <label htmlFor="check-in" className="block text-sm">Check-in Date</label>
        <input
          type="date"
          id="check-in"
          name="checkInDate"
          value={formData.checkInDate}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          min={new Date().toISOString().split("T")[0]} // Set minimum date to today
        />
      </div>

      <div className="my-4">
        <label htmlFor="check-out" className="block text-sm">Check-out Date</label>
        <input
          type="date"
          id="check-out"
          name="checkOutDate"
          value={formData.checkOutDate}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          min={formData.checkInDate || new Date().toISOString().split("T")[0]} // Set min to check-in or today
        />
      </div>


      {/* Amenities */}
      <div className="my-4">
        <p className="text-sm">Select Amenities</p>
        <div className="space-y-2">
          {amenitiesList.map((amenity) => (
            <div key={amenity.id} className="flex items-center">
              <input
                type="checkbox"
                id={`amenity-${amenity.id}`}
                name={amenity.name.replace(/\s+/g, '')} // Convert name to match formData keys
                onChange={handleAmenitiesChange}
                checked={formData[amenity.name.replace(/\s+/g, '')]} // Use boolean value from formData
                className="mr-2"
              />
              <label htmlFor={`amenity-${amenity.id}`} className="text-sm">
                {amenity.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Status Message */}
      {bookingStatus && (
        <div className="mt-4 p-2 text-center text-green-500 font-semibold">
          {bookingStatus}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleSaveChanges}
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
        >
          Confirm
        </button>
        <button
          onClick={handleCancelBooking}
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
