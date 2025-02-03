import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user", password: "" });
  const [editingUser, setEditingUser] = useState(null); // State to track the user being edited
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return toast.error("Token not found. Please login again.");
        }
        const { data } = await axios.get(`${backendUrl}/api/admin/manage-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          const filteredUsers = data.users.filter((user) => user.role === "user");
          setUsers(filteredUsers);
        } else {
          toast.error(data.message || "Failed to fetch users.");
        }
      } catch (err) {
        toast.error("Failed to fetch users. Please try again.");
        console.error(err.message);
      }
    };

    fetchUsers();
  }, [backendUrl]);

  // Add User Function
  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return toast.error("Token not found. Please login again.");
      }

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-user`,
        newUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success("User added successfully!");
        setUsers([...users, data.user]); // Update users list
        setIsModalOpen(false);
        setNewUser({ name: "", email: "", role: "user", password: "" }); // Reset form
      } else {
        toast.error(data.message || "Failed to add user.");
      }
    } catch (err) {
      toast.error("Failed to add user. Please try again.");
      console.error(err.message);
    }
  };

  // Edit User Function
  const handleEdit = async (userId, updatedUser) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return toast.error("Token not found. Please login again.");
      }

      const { data } = await axios.put(
        `${backendUrl}/api/admin/update-user/${userId}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success("User updated successfully!");
        setUsers(users.map((user) => (user._id === userId ? data.user : user))); // Update users list
        setIsModalOpen(false);
        setEditingUser(null); // Reset editing user
        setNewUser({ name: "", email: "", role: "user", password: "" }); // Reset the form
      } else {
        toast.error(data.message || "Failed to update user.");
      }
    } catch (err) {
      toast.error("Failed to update user. Please try again.");
      console.error(err.message);
    }
  };

  // Delete User Function
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return toast.error("Token not found. Please login again.");
        }

        const { data } = await axios.delete(
          `${backendUrl}/api/admin/delete-user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.success) {
          toast.success("User deleted successfully!");
          setUsers(users.filter((user) => user._id !== userId)); // Update users list
        } else {
          toast.error(data.message || "Failed to delete user.");
        }
      } catch (err) {
        toast.error("Failed to delete user. Please try again.");
        console.error(err.message);
      }
    }
  };

  // Reset form and close modal
  const resetFormAndCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setNewUser({ name: "", email: "", role: "user", password: "" });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">
        User Management
      </h1>
      <div className="flex justify-end mb-4">
        {/* Add User Button */}
        <button
          onClick={() => {
            setEditingUser(null); // Reset editing user
            setIsModalOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition"
        >
          Add User
        </button>
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full text-sm text-left text-gray-500 border-collapse">
          <thead className="bg-blue-500 text-white uppercase text-sm">
            <tr>
              <th className="px-6 py-3 border">Sr</th>
              <th className="px-6 py-3 border">Name</th>
              <th className="px-6 py-3 border">Email</th>
              <th className="px-6 py-3 border">Role</th>
              <th className="px-6 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                  } hover:bg-blue-100 transition`}
                >
                  <td className="px-6 py-4 border font-medium text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 border text-gray-700">{user.name}</td>
                  <td className="px-6 py-4 border text-gray-700">{user.email}</td>
                  <td
                    className={`px-6 py-4 border text-sm font-semibold ${
                      user.role === "admin" ? "text-blue-600" : "text-green-600"
                    }`}
                  >
                    {user.role}
                  </td>
                  <td className="px-6 py-4 border">
                  <button
                      onClick={() => {
                        setEditingUser(user); // Set the user being edited
                        setNewUser({ 
                          name: user.name, 
                          email: user.email.trim(), // Fix extra characters issue
                          role: user.role, 
                          password: "" 
                        }); // Populate the form correctly
                        setIsModalOpen(true); // Open the modal
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-lg mr-2 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-6 py-4 border text-center text-black font-medium"
                  colSpan={5}
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 ">
              {editingUser ? "Edit User" : "Add User"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-1">
                Name
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-1">
                Email
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-black"
              />
            </div>
            {!editingUser && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-black"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Role
              </label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-black"
              >
                <option value="user">User</option>
                
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={resetFormAndCloseModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingUser) {
                    handleEdit(editingUser._id, newUser); // Call handleEdit with the user ID and updated data
                  } else {
                    handleAddUser(); // Call handleAddUser for adding a new user
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                {editingUser ? "Update User" : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;