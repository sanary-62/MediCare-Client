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
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-8">
        Camp Feedback and Ratings
      </h2>

      {feedbackList.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No feedback submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {feedbackList.map((fb) => (
            <div
              key={fb._id}
              className="border border-gray-200 rounded-lg p-6 shadow-md bg-white flex flex-col"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-blue-700 mb-2">
                {fb.campName}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-3">
                Date: {new Date(fb.date).toLocaleDateString()}
              </p>
              <p className="text-gray-800 mb-4 flex-grow">"{fb.feedback}"</p>
              <div className="flex items-center space-x-1 text-xl">
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
