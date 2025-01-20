import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
    const navigate = useNavigate();

    const [staffList, setStaffList] = useState([
        { id: 1, name: "Alice Johnson", role: "Manager" },
        { id: 2, name: "Bob Smith", role: "Receptionist" },
        { id: 3, name: "Charlie Brown", role: "Housekeeping" },
    ]);

    const [newStaff, setNewStaff] = useState({ name: "", role: "" });
    const [editingStaff, setEditingStaff] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleAddStaff = () => {
        if (!newStaff.name || !newStaff.role) {
            alert("Please fill out both fields.");
            return;
        }

        if (editingStaff) {
            setStaffList((prev) =>
                prev.map((staff) =>
                    staff.id === editingStaff.id ? { ...staff, ...newStaff } : staff
                )
            );
            alert("Staff member updated successfully.");
        } else {
            const newEntry = {
                id: staffList.length + 1,
                name: newStaff.name,
                role: newStaff.role,
            };
            setStaffList((prev) => [...prev, newEntry]);
            alert("Staff member added successfully.");
        }

        setNewStaff({ name: "", role: "" });
        setEditingStaff(null);
        setShowForm(false);
    };

    const handleEditStaff = (staff) => {
        setEditingStaff(staff);
        setNewStaff({ name: staff.name, role: staff.role });
        setShowForm(true);
    };

    const handleDeleteStaff = (id) => {
        setStaffList((prev) => prev.filter((staff) => staff.id !== id));
        alert("Staff member deleted successfully.");
    };

    const filteredStaff = staffList.filter((staff) =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg rounded-lg relative">
            <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">User Management</h2>

            {/* Add Staff Button */}
            <button
                onClick={() => setShowForm(true)}
                className="absolute top-6 right-6 bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-300"
            >
                Add Staff
            </button>

            {/* Search Staff Section */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search Staff"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
            </div>

            {/* Staff Table */}
            <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <thead>
                    <tr className="bg-purple-500 text-white">
                        <th className="px-6 py-3 text-left">Name of Staff</th>
                        <th className="px-6 py-3 text-left">Role</th>
                        <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStaff.map((staff) => (
                        <tr key={staff.id} className="hover:bg-purple-50">
                            <td className="px-6 py-3 text-left font-medium text-gray-800">{staff.name}</td>
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


            {/* Add/Edit Staff Form */}
            {showForm && (
                <div className="mb-6 bg-white p-4 rounded-md shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {editingStaff ? "Edit Staff" : "Add Staff"}
                    </h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={newStaff.name}
                            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <input
                            type="text"
                            placeholder="Role"
                            value={newStaff.role}
                            onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={handleAddStaff}
                                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-300"
                            >
                                {editingStaff ? "Update Staff" : "Add Staff"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    navigate("/AdminHomepage");
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
