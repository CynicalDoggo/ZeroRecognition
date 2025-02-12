import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [newStaff, setNewStaff] = useState({ email: "", password: "" });
  const [editingStaff, setEditingStaff] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const response = await fetch("http://localhost:5000/get_all_staff");
      if (!response.ok) throw new Error("Failed to fetch staff data");
      const data = await response.json();
      setStaffList(data);
    } catch (error) {
      console.error("Error fetching staff data:", error);
    }
  };

  // Add a new staff member
  const handleAddStaff = async () => {
    try {
      const response = await fetch("http://localhost:5000/add_staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newStaff.email,
          password: newStaff.password
        })
      });
      if (!response.ok) throw new Error("Failed to add staff");
      alert("Staff member added successfully.");
      fetchStaffData();
      // Reset form state
      setNewStaff({ email: "", password: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  const handleUpdateStaff = async () => {
    if (!editingStaff) return;
    try {
      const response = await fetch(`http://localhost:5000/edit_staff/${editingStaff.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newStaff.email,
          password: newStaff.password  // This field is optional; if empty, the backend won't update the password.
        }),
      });
      if (!response.ok) throw new Error("Failed to update staff");
      alert("Staff member updated successfully.");
      fetchStaffData();
      // Clear editing state and reset form
      setEditingStaff(null);
      setNewStaff({ email: "", password: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  // When user clicks "Edit", fill in the form and set editing state
  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setNewStaff({ email: staff.email, password: "" });
    setShowForm(true);
  };

  const handleDeleteStaff = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_staff/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete staff");
      alert("Staff member deleted successfully.");
      fetchStaffData();
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  const filteredStaff = staffList.filter((staff) =>
    staff.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg rounded-lg relative">
      <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">User Management</h2>
      <button
        onClick={() => {
          // Clear editing state and show a blank form for adding staff
          setEditingStaff(null);
          setNewStaff({ email: "", password: "" });
          setShowForm(true);
        }}
        className="absolute top-6 right-6 bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-300"
      >
        Add Staff
      </button>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Staff"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>
      <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <thead>
          <tr className="bg-purple-500 text-white">
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Role</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((staff) => (
            <tr key={staff.id} className="hover:bg-purple-50">
              <td className="px-6 py-3 text-left font-medium text-gray-800">{staff.email}</td>
              <td className="px-6 py-3 text-left font-medium text-gray-800">{staff.role}</td>
              <td className="px-6 py-3 text-left">
                <button
                  onClick={() => handleEditStaff(staff)}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteStaff(staff.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <div className="mb-6 bg-white p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingStaff ? "Edit Staff" : "Add Staff"}
          </h3>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={newStaff.email}
              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={newStaff.password}
              onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              // Call the update function if editing, otherwise add function
              onClick={editingStaff ? handleUpdateStaff : handleAddStaff}
              className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition duration-300"
            >
              {editingStaff ? "Update Staff" : "Add Staff"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
