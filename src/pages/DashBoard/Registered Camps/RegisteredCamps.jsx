import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import SearchBar from "../../SearchBar/SearchBar";

const RegisteredCamps = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [registeredCamps, setRegisteredCamps] = useState([]);

  // New state for search term
  const [searchTerm, setSearchTerm] = useState("");

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [currentFeedbackCamp, setCurrentFeedbackCamp] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 5; // items per page

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/get-participants?email=${user.email}&page=${page}&limit=${limit}`)
        .then((res) => {
          setRegisteredCamps(res.data || []);
          // setTotalPages(res.data || 1);
        })
        .catch((err) => {
          console.error("Error fetching registrations", err);
        });
    }
  }, [user, axiosSecure, page]);
  console.log(registeredCamps)

  // Filter camps by search term
  const filteredCamps = registeredCamps.filter((camp) => {
    const term = searchTerm.toLowerCase();
    const campName = camp.campName?.toLowerCase() || "";
    const participantName = camp.participantName?.toLowerCase() || "";
    const campDate = camp.date ? new Date(camp.date).toLocaleDateString() : "";
    const campDateStr = campDate.toLowerCase();
    // Assuming healthcareProfessionalName exists
    const healthcareName = camp.healthcareProfessionalName?.toLowerCase() || "";

    return (
      campName.includes(term) ||
      participantName.includes(term) ||
      campDateStr.includes(term) ||
      healthcareName.includes(term)
    );
  });

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this registration?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/participants/${id}`);
        // setRegisteredCamps((prev) => prev.filter((item) => item._id !== id));



 axiosSecure
  .get(`/get-participants?email=${user.email}&page=${page}&limit=${limit}`)
  .then((res) => {
    const camps = res.data?.data || [];
    const total = res.data?.pagination?.total || 0;
    const totalPages = Math.ceil(total / limit);

    if (camps.length === 0 && page > 1) {
      // current page became empty → go back one page
      setPage((prev) => prev - 1);
    } else {
      setRegisteredCamps(camps);
      setTotalPages(totalPages);
    }
  })

  .catch((err) => {
    console.error("Error refreshing registrations", err);
  });



        Swal.fire("Cancelled!", "Registration has been cancelled.", "success");
      } catch (err) {
        console.error("Error canceling registration:", err);
        Swal.fire("Error!", "Failed to cancel registration.", "error");
      }
    }
  };

  const handleFeedback = (campName, participantId, campImage) => {
    setCurrentFeedbackCamp({ campName, participantId, campImage });
    setFeedbackText("");
    setRating(0);
    setFeedbackModalOpen(true);
  };

  const submitFeedback = async () => {
    if (!feedbackText.trim()) {
      Swal.fire("Validation Error", "Feedback is required.", "warning");
      return;
    }
    if (rating < 1 || rating > 5) {
      Swal.fire(
        "Validation Error",
        "Please select a rating between 1 and 5.",
        "warning"
      );
      return;
    }
    try {
      await axiosSecure.post("/feedback", {
        participantId: currentFeedbackCamp.participantId,
        campName: currentFeedbackCamp.campName,
        campImage: currentFeedbackCamp.campImage,
        feedback: feedbackText,
        rating,
        date: new Date().toISOString(),
      });
      setFeedbackModalOpen(false);
      Swal.fire("Thanks!", "Your feedback has been submitted.", "success");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      Swal.fire("Error!", "Failed to submit feedback.", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        My Registered Camps
      </h2>

      {/* SearchBar added here */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search by camp name, date, or participant name"
      />

      {filteredCamps.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No camps registered yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto mt-4 rounded-lg shadow-lg">
            <table className="table table-zebra w-full min-w-[600px]">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th>#</th>
                  <th>Camp Name</th>
                  <th>Fees</th>
                  <th>Participant</th>
                  <th>Payment</th>
                  <th>Confirmed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCamps.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(page - 1) * limit + index + 1}</td>
                    <td>{item.campName}</td>
                    <td>${item.fees}</td>
                    <td>{item.participantName}</td>
                    <td>
                      {item.paymentStatus === "paid" ? (
                        <button className="btn btn-sm btn-success btn-disabled text-gray-500">
                          Paid
                        </button>
                      ) : (
                        <Link to={`/dashboard/payment/${item.campId}`}>
                          <button className="btn btn-sm btn-success bg-blue-700 text-white">
                            Pay
                          </button>
                        </Link>
                      )}
                    </td>
                    <td
                      className={
                        item.confirmationStatus === "Confirmed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }
                    >
                      {item.confirmationStatus || "Pending"}
                    </td>
                    <td className="space-x-2 flex flex-wrap gap-2 justify-center">
                      {item.paymentStatus === "paid" && (
                        <button
                          className="btn btn-sm btn-outline btn-info"
                          onClick={() =>
                            handleFeedback(
                              item.campName,
                              item._id,
                              item.campImage
                            )
                          }
                        >
                          Feedback
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline btn-error text-gray-500"
                        onClick={() => handleCancel(item._id)}
                        disabled={item.paymentStatus === "paid"}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
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

      {feedbackModalOpen && (
        <div className="fixed inset-0 backdrop-brightness-75 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Feedback for {currentFeedbackCamp?.campName}
            </h3>

            <div className="rating mb-4 justify-center flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <input
                  key={star}
                  type="radio"
                  name="rating"
                  className="mask mask-star-2 bg-orange-400"
                  aria-label={`${star} star`}
                  checked={rating === star}
                  onChange={() => setRating(star)}
                />
              ))}
            </div>

            <textarea
              className="textarea textarea-bordered w-full mb-4"
              placeholder="Type your feedback here..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />

            <div className="flex justify-end space-x-3 flex-wrap gap-2">
              <button
                className="btn btn-outline flex-1 min-w-[100px]"
                onClick={() => setFeedbackModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary flex-1 min-w-[100px]"
                onClick={submitFeedback}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredCamps;
