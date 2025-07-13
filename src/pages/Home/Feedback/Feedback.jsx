import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Feedback = () => {
  const axiosSecure = useAxiosSecure();
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    axiosSecure
      .get("/feedback")
      .then((res) => setFeedbackList(res.data))
      .catch((err) => console.error("Failed to load feedback", err));
  }, [axiosSecure]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Camp Feedback and Ratings
      </h2>

      {feedbackList.length === 0 ? (
        <p className="text-center text-gray-500">No feedback submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feedbackList.map((fb) => (
            <div
              key={fb._id}
              className="border border-gray-200 rounded-lg p-4 shadow-md bg-white"
            >
              <h3 className="text-xl font-semibold text-blue-700">
                {fb.campName}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Date: {new Date(fb.date).toLocaleDateString()}
              </p>
              <p className="text-gray-800 mb-3">"{fb.feedback}"</p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < fb.rating ? (
                      <span className="text-yellow-400">★</span>
                    ) : (
                      <span className="text-gray-300">★</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;
