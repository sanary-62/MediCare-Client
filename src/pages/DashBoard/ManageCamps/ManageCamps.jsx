import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const ManageCamps = () => {
  const [camps, setCamps] = useState([]);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/camps?organizerEmail=${user.email}`)
        .then((res) => setCamps(res.data))
        .catch((err) => console.error(err));
    }
  }, [user, axiosSecure]);

  const handleDelete = async (campId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the camp!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/delete-camp/${campId}`);
        if (res.data.deletedCount > 0) {
          setCamps((prev) => prev.filter((camp) => camp._id !== campId));
          Swal.fire("Deleted!", "Camp has been deleted.", "success");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete the camp.", "error");
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-4xl font-bold text-blue-700 mb-6">Manage Camps</h2>
      {camps.length === 0 ? (
        <p className="text-gray-600">No camps found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border border-gray-300">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th>#</th>
                <th>Camp Name</th>
                <th>Date & Time</th>
                <th>Location</th>
                <th>Healthcare Professional</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {camps.map((camp, index) => (
                <tr key={camp._id} className="hover">
                  <td>{index + 1}</td>
                  <td>{camp.campName}</td>
                  <td>{new Date(camp.date).toLocaleString()}</td>
                  <td>{camp.location}</td>
                  <td>{camp.healthcareProfessional}</td>
                  <td className="space-x-2 flex">
                    <Link to={`/dashboard/update-camp/${camp._id}`}>
                      <button className="btn btn-sm btn-warning text-white bg-green-600 ">Update</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(camp._id)}
                      className="btn btn-sm btn-error bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageCamps;
