import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import SearchBar from "../../SearchBar/SearchBar";  

const ManageAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [searchEmail, setSearchEmail] = useState("");
  const [user, setUser] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await axiosSecure.get(`/users/search?email=${searchEmail}`);
      setUser(res.data);
    } catch (err) {
      setUser(null);
      Swal.fire("Not Found", "User not found", "error");
    }
  };

  useEffect(() => {
    if (searchEmail.length > 0) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setUser(null);
    }
  }, [searchEmail]);

  const handleRoleChange = async (newRole) => {
    try {
      const res = await axiosSecure.patch(`/users/role/${user.email}`, { role: newRole });
      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", `Role updated to ${newRole}`, "success");
        setUser((prev) => ({ ...prev, role: newRole }));
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  return (
    <div className="p-6 w-full mx-auto">
      <h2 className="text-4xl font-bold text-blue-700 mb-6 text-center ">Manage Admin</h2>

      {/* Replaced input and button with SearchBar component */}
      <div className="flex items-center gap-2 mb-6 w-96">
        <SearchBar
          searchTerm={searchEmail}
          setSearchTerm={setSearchEmail}
          placeholder="Enter email to search"
        />
      </div>

      {user && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-center bg-base-100 shadow border border-gray-300 rounded">
            <thead className="bg-base-200 text-base">
              <tr>
                <th>Email</th>
                <th>Created At</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{user.email}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
                <td>{user.role || "user"}</td>
                <td>
                  {user.role !== "admin" ? (
                    <button
                      className="btn btn-sm text-white bg-green-700"
                      onClick={() => handleRoleChange("admin")}
                    >
                      Make Admin
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm text-white bg-red-700"
                      onClick={() => handleRoleChange("user")}
                    >
                      Remove Admin
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageAdmin;
