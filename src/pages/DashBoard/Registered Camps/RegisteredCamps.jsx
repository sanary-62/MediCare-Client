

import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const RegisteredCamps = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [registeredCamps, setRegisteredCamps] = useState([]);

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [currentFeedbackCamp, setCurrentFeedbackCamp] = useState(null); // {campName, participantId, campImage}
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/participants?email=${user.email}`)
        .then((res) => setRegisteredCamps(res.data))
        .catch((err) => console.error("Error fetching registrations", err));
    }
  }, [user, axiosSecure]);

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
        setRegisteredCamps((prev) => prev.filter((item) => item._id !== id));
        Swal.fire("Cancelled!", "Registration has been cancelled.", "success");
      } catch (error) {
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
      Swal.fire("Validation Error", "Please select a rating between 1 and 5.", "warning");
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
    } catch (error) {
      Swal.fire("Error!", "Failed to submit feedback.", "error");
    }
  };

  const handlePayment = async (id) => {
    try {
      const transactionId = "txn_" + Math.random().toString(36).substr(2, 9);

      await Swal.fire(
        "Payment Successful",
        `Transaction ID: ${transactionId}`,
        "success"
      );

      setRegisteredCamps((prev) =>
        prev.map((camp) =>
          camp._id === id
            ? {
                ...camp,
                paymentStatus: "paid",
                confirmationStatus: "Confirmed",
                transactionId,
              }
            : camp
        )
      );
    } catch (error) {
      console.error("Payment error:", error.response || error.message || error);
      Swal.fire("Payment Failed", "Please try again.", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        My Registered Camps
      </h2>
      {registeredCamps.length === 0 ? (
        <p className="text-center text-gray-500">No camps registered yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
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
              {registeredCamps.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.campName}</td>
                  <td>${item.fees}</td>
                  <td>{item.participantName}</td>
                  <td>
                    {item.paymentStatus === "paid" ? (
                      <button className="btn btn-sm btn-success btn-disabled text-gray-500">
                        Paid
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handlePayment(item._id)}
                      >
                        Pay
                      </button>
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
                  <td className="space-x-2">
                    {item.paymentStatus === "paid" && (
                      <button
                        className="btn btn-sm btn-outline btn-info"
                        onClick={() =>
                          handleFeedback(item.campName, item._id, item.campImage)
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
      )}

      {feedbackModalOpen && (
        <div className="fixed inset-0 backdrop-brightness-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <h3 className="text-xl font-semibold mb-4">
              Feedback for {currentFeedbackCamp?.campName}
            </h3>

            <div className="rating mb-4 justify-center">
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

            <div className="flex justify-end space-x-3">
              <button
                className="btn btn-outline"
                onClick={() => setFeedbackModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={submitFeedback}>
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
