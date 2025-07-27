import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import SearchBar from "../../SearchBar/SearchBar"; 

const ManageRegisteredCamps = () => {
  const [registrations, setRegistrations] = useState([]);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; 

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(
          `/registered-camps?organizerEmail=${user.email}&page=${page}&limit=${limit}`
        )
        .then((res) => {
          setRegistrations(res.data.registrations);
          setTotalPages(res.data.totalPages);
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [user, axiosSecure, page]);

  const handleConfirm = async (id) => {
    try {
      const res = await axiosSecure.patch(`/confirm-registration/${id}`);
      if (res.data.modifiedCount > 0) {
        setRegistrations((prev) =>
          prev.map((r) =>
            r._id === id ? { ...r, confirmationStatus: "Confirmed" } : r
          )
        );
        Swal.fire("Success", "Confirmation updated to Confirmed!", "success");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to confirm status", "error");
    }
  };

  const handleCancel = async (id, isDisabled) => {
    if (isDisabled) return;

    const confirm = await Swal.fire({
      title: "Cancel Registration?",
      text: "This will remove the participant from this camp.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/cancel-registration/${id}`);
        if (res.data.deletedCount > 0) {
          setRegistrations((prev) => prev.filter((r) => r._id !== id));
          Swal.fire("Cancelled", "The registration has been removed.", "success");

          if (registrations.length === 1 && page > 1) {
            setPage(page - 1);
          }
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Cancellation failed", "error");
      }
    }
  };

  // Filter registrations by search term (campName or participantName)
  const filteredRegistrations = searchTerm
    ? registrations.filter((reg) => {
        const term = searchTerm.toLowerCase();
        const campName = reg.campName?.toLowerCase() || "";
        const participantName = reg.participantName?.toLowerCase() || "";
        return campName.includes(term) || participantName.includes(term);
      })
    : registrations;

  return (
    <div className="p-4 max-w-7xl mx-auto w-full">
      <h2 className="text-4xl font-bold text-blue-700 mb-6 text-center">
        Manage Registered Camps
      </h2>

      <div className="mb-6 px-2 max-w-md mx-auto">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search by camp or participant name"
        />
      </div>

      {filteredRegistrations?.length === 0 ? (
        <p className="text-gray-600 text-center">No registered participants found.</p>
      ) : (
        <>
          <div className="overflow-x-auto px-2">
            <table className="table w-full text-black border border-gray-300 rounded-md">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="whitespace-nowrap">#</th>
                  <th className="whitespace-nowrap">Camp Name</th>
                  <th className="whitespace-nowrap">Fees</th>
                  <th className="whitespace-nowrap">Participant Name</th>
                  <th className="whitespace-nowrap">Payment Status</th>
                  <th className="whitespace-nowrap">Confirmation</th>
                  <th className="whitespace-nowrap">Cancel</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations?.map((reg, idx) => {
                  const isPaidConfirmed =
                    reg.paymentStatus?.toLowerCase() === "paid" &&
                    reg.confirmationStatus?.toLowerCase() === "confirmed";

                  return (
                    <tr key={reg._id} className="hover">
                      <td>{(page - 1) * limit + idx + 1}</td>
                      <td>{reg?.campName}</td>
                      <td>${reg?.fees || 0}</td>
                      <td>{reg?.participantName}</td>
                      <td>
                        <span
                          className={`badge ${
                            reg?.paymentStatus === "Paid"
                              ? "bg-green-700 text-white btn btn-sm"
                              : "bg-blue-500 text-white btn btn-sm"
                          }`}
                        >
                          {reg?.paymentStatus}
                        </span>
                      </td>
                      <td>
                        {reg.confirmationStatus === "Confirmed" ? (
                          <span className="badge badge-success btn btn-sm bg-green-600 text-white">
                            Confirmed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleConfirm(reg._id)}
                            className="btn btn-sm btn-warning whitespace-nowrap"
                          >
                            {reg?.confirmationStatus}
                          </button>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleCancel(reg._id, isPaidConfirmed)}
                          className={`btn btn-sm ${
                            isPaidConfirmed
                              ? "btn-disabled whitespace-nowrap"
                              : "btn-error bg-red-600 text-white whitespace-nowrap"
                          }`}
                          disabled={isPaidConfirmed}
                        >
                          cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
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

export default ManageRegisteredCamps;
