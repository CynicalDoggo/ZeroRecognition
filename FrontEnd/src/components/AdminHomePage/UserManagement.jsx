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
                className="absolute top-6 right-6 flex items-center bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-300"
                >
                <svg 
                    className="w-6 h-6 text-white mr-2" 
                    aria-hidden="true" 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    fill="none" 
                    viewBox="0 0 24 24"
                >
                    <path 
                    stroke="currentColor" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                </svg>
                Add Staff
            </button>


            {/* Search Staff Section */}
            <div className="mb-6 relative">
                <svg 
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-white" 
                    aria-hidden="true" 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    fill="none" 
                    viewBox="0 0 24 24"
                >
                    <path 
                    stroke="currentColor" 
                    stroke-linecap="round" 
                    stroke-width="2" 
                    d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Search Staff"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditStaff(staff)}
                              className="bg-blue-500 text-white flex items-center px-4 py-1 rounded hover:bg-blue-600 transition duration-300"
                            >
                              <svg 
                                className="w-5 h-5 text-white mr-2" 
                                aria-hidden="true" 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24" 
                                fill="none" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  stroke="currentColor" 
                                  stroke-linecap="square" 
                                  stroke-linejoin="round" 
                                  stroke-width="2" 
                                  d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z"
                                />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(staff.id)}
                              className="bg-red-500 text-white flex items-center px-4 py-1 rounded hover:bg-red-600 transition duration-300"
                            >
                              <svg 
                                className="w-5 h-5 text-white mr-2" 
                                aria-hidden="true" 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24" 
                                fill="none" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  stroke="currentColor" 
                                  stroke-linecap="round" 
                                  stroke-linejoin="round" 
                                  stroke-width="2" 
                                  d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
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
