import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {

  const navigate = useNavigate(); // Initialize navigate
  // State for booking form fields
  const [formData, setFormData] = useState({
    roomType: '',
    checkInDate: '',
    checkOutDate: '',
    selectedAmenities: [],
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
    const value = e.target.value;
    if (e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        selectedAmenities: [...prev.selectedAmenities, value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedAmenities: prev.selectedAmenities.filter(
          (amenity) => amenity !== value
        ),
      }));
    }
  };

  // Handle form submission (Save Booking)
  const handleSaveChanges = () => {
    const { roomType, checkInDate, checkOutDate } = formData;
    if (!roomType || !checkInDate || !checkOutDate) {
      alert('Please fill in all required fields');
      return;
    }
    console.log(formData);
    navigate('/Homepage');
  };

  // Handle cancel booking
  const handleCancelBooking = () => {
    setFormData({
      roomType: '',
      checkInDate: '',
      checkOutDate: '',
      selectedAmenities: [],
    });
    navigate('/Homepage');
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
                value={amenity.name}
                onChange={handleAmenitiesChange}
                checked={formData.selectedAmenities.includes(amenity.name)}
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
