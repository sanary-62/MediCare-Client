import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const ManageRegisteredCamps = () => {
  const [registrations, setRegistrations] = useState([]);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/registered-camps?organizerEmail=${user.email}`)
        .then((res) => setRegistrations(res.data))
        .catch((err) => console.error(err));
    }
  }, [user, axiosSecure]);

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
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Cancellation failed", "error");
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-4xl font-bold text-blue-700 mb-6">
        Manage Registered Camps
      </h2>

      {registrations.length === 0 ? (
        <p className="text-gray-600">No registered participants found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th>#</th>
                <th>Camp Name</th>
                <th>Fees</th>
                <th>Participant Name</th>
                <th>Payment Status</th>
                <th>Confirmation</th>
                <th>Cancel</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg, idx) => {
                const isPaidConfirmed =
                  reg.paymentStatus === "Paid" &&
                  reg.confirmationStatus === "Confirmed";

                return (
                  <tr key={reg._id} className="hover">
                    <td>{idx + 1}</td>
                    <td>{reg.campName}</td>
                    <td>${reg.fees}</td>
                    <td>{reg.participantName}</td>
                    <td>
                      <span
                        className={`badge ${
                          reg.paymentStatus === "Paid"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {reg.paymentStatus}
                      </span>
                    </td>
                    <td>
                      {reg.confirmationStatus === "Confirmed" ? (
                        <span className="badge badge-success">
                          Confirmed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConfirm(reg._id)}
                          className="btn btn-sm btn-warning"
                        >
                          {reg.confirmationStatus}
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          handleCancel(reg._id, isPaidConfirmed)
                        }
                        className="btn btn-sm btn-error"
                        disabled={isPaidConfirmed}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageRegisteredCamps;
