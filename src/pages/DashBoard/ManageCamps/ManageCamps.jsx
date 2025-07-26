import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import SearchBar from "../../SearchBar/SearchBar"; 

const ManageCamps = () => {
  const [camps, setCamps] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; 

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/camps?organizerEmail=${user.email}&page=${page}&limit=${limit}`)
      .then((res) => {
  const data = Array.isArray(res.data) ? res.data : res.data.camps ?? [];
  setCamps(data);
  setTotalPages(res.data.totalPages ?? 1); // Or set to 1 if no pagination
})


        .catch((err) => console.error(err));
    }
  }, [user, axiosSecure, page]);

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
        setCamps((prevCamps) => {
          const updated = prevCamps.filter((camp) => camp._id !== campId);
          if (updated.length === 0 && page > 1) {
            setPage((prevPage) => prevPage - 1);
          }
          return updated;
        });
        Swal.fire("Deleted!", "Camp has been deleted.", "success");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete the camp.", "error");
    }
  }
};


  // Filter camps by search term (campName or location)
 const filteredCamps = (camps || []).filter((camp) => {
  const term = searchTerm.toLowerCase();
  const campName = camp.campName?.toLowerCase() || "";
  const location = camp.location?.toLowerCase() || "";
  return campName.includes(term) || location.includes(term);
});

  return (
    <div className="p-4">
      <h2 className="text-4xl font-bold text-blue-700 mb-6">Manage Camps</h2>

      {/* SearchBar added */}
     <SearchBar
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  placeholder="Search by camp name or location"
/>


      {filteredCamps.length === 0 ? (
        <p className="text-gray-600">No camps found.</p>
      ) : (
        <>
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
                {filteredCamps.map((camp, index) => (
                  <tr key={camp._id} className="hover">
                    <td>{(page - 1) * limit + index + 1}</td>
                    <td>{camp.campName}</td>
                    <td>{new Date(camp.date).toLocaleString()}</td>
                    <td>{camp.location}</td>
                    <td>{camp.healthcareProfessional}</td>
                    <td className="space-x-2 flex">
                      <Link to={`/dashboard/update-camp/${camp._id}`}>
                        <button className="btn btn-sm btn-warning text-white bg-green-600 ">
                          Update
                        </button>
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

          {/* Pagination Controls */}
          <div className="flex justify-center gap-3 mt-4">
            <button
              className="btn btn-sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>
            <span className="btn btn-sm btn-disabled">{page}</span>
            <button
              className="btn btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageCamps;
