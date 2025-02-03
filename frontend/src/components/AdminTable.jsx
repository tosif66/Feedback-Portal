import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const AdminTable = () => {
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", role: "admin", password: "" });
  const [editingAdmin, setEditingAdmin] = useState(null); // State to track the admin being edited
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return toast.error("Token not found. Please login again.");
        }
        const { data } = await axios.get(`${backendUrl}/api/admin/manage-admins`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(data);
        

        if (data.success) {
          const filteredAdmins = data.admins.filter((user) => user.role === "admin");
          setAdmins(filteredAdmins);
        } else {
          toast.error(data.message || "Failed to fetch admins.");
        }
      } catch (err) {
        toast.error("Failed to fetch admins. Please try again.");
        console.error(err.message);
      }
    };

    fetchAdmins();
  }, [backendUrl]);

  // Add Admin Function
  const handleAddAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return toast.error("Token not found. Please login again.");
      }

      const { data } = await axios.post(
        `${backendUrl}/api/admin/create-admin`,
        newAdmin,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success("Admin added successfully!");
        setAdmins([...admins, data.user]); 
        setIsModalOpen(false);
        setNewAdmin({ name: "", email: "", role: "admin", password: "" }); 
      } else {
        toast.error(data.message || "Failed to add admin.");
      }
    } catch (err) {
      toast.error("Failed to add admin. Please try again.");
      console.error(err.message);
    }
  };

  // Edit Admin Function
  const handleEdit = async (adminId, updatedAdmin) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return toast.error("Token not found. Please login again.");
      }

      const { data } = await axios.put(
        `${backendUrl}/api/admin/update-admin/${adminId}`,
        updatedAdmin,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success("Admin updated successfully!");
        setAdmins(admins.map((admin) => (admin._id === adminId ? data.user : admin)));
        setIsModalOpen(false);
        setEditingAdmin(null); 
        setNewAdmin({ name: "", email: "", role: "admin", password: "" });
      } else {
        toast.error(data.message || "Failed to update admin.");
      }
    } catch (err) {
      toast.error("Failed to update admin. Please try again.");
      console.error(err.message);
    }
  };

  // Delete Admin Function
  const handleDelete = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return toast.error("Token not found. Please login again.");
        }

        const { data } = await axios.delete(
          `${backendUrl}/api/admin/delete-user/${adminId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.success) {
          toast.success("Admin deleted successfully!");
          setAdmins(admins.filter((admin) => admin._id !== adminId)); 
        } else {
          toast.error(data.message || "Failed to delete admin.");
        }
      } catch (err) {
        toast.error("Failed to delete admin. Please try again.");
        console.error(err.message);
      }
    }
  };

  // Reset form and close modal
  const resetFormAndCloseModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
    setNewAdmin({ name: "", email: "", role: "admin", password: "" });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">
        Admin Management
      </h1>
      <div className="flex justify-end mb-4">
        {/* Add Admin Button */}
        <button
          onClick={() => {
            setEditingAdmin(null); 
            setIsModalOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition"
        >
          Add Admin
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
            {admins.length > 0 ? (
              admins.map((admin, index) => (
                <tr
                  key={admin._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                  } hover:bg-blue-100 transition`}
                >
                  <td className="px-6 py-4 border font-medium text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 border text-gray-700">{admin.name}</td>
                  <td className="px-6 py-4 border text-gray-700">{admin.email}</td>
                  <td className="px-6 py-4 border text-sm font-semibold text-blue-600">
                    {admin.role}
                  </td>
                  <td className="px-6 py-4 border">
                    <button
                      onClick={() => {
                        setEditingAdmin(admin); 
                        setNewAdmin({ 
                          name: admin.name, 
                          email: admin.email.trim(), 
                          role: admin.role, 
                          password: "" 
                        }); 
                        setIsModalOpen(true); 
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-lg mr-2 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(admin._id)}
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
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 ">
              {editingAdmin ? "Edit Admin" : "Add Admin"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-1">
                Name
              </label>
              <input
                type="text"
                value={newAdmin.name}
                onChange={(e) =>
                  setNewAdmin((prev) => ({ ...prev, name: e.target.value }))
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
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-black"
              />
            </div>
            {!editingAdmin && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) =>
                    setNewAdmin((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-black"
                />
              </div>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={resetFormAndCloseModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingAdmin) {
                    handleEdit(editingAdmin._id, newAdmin);
                  } else {
                    handleAddAdmin();
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                {editingAdmin ? "Update Admin" : "Add Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;