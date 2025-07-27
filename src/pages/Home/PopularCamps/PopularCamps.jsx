import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PopularCamps = () => {
  const axiosSecure = useAxiosSecure();
  const [popularCamps, setPopularCamps] = useState([]);

  useEffect(() => {
    axiosSecure
      .get("/camps")
      .then((res) => {
        console.log(res.data);
        const sorted = res.data.camps
          .slice()
          .sort((a, b) => b.participantCount - a.participantCount)
          .slice(0, 6);
        setPopularCamps(sorted);
      })
      .catch((err) => {
        console.error("Failed to load camps:", err);
      });
  }, [axiosSecure]);

  if (popularCamps.length === 0)
    return (
      <section className="py-12 text-center">
        <p className="text-gray-500">No popular camps to display.</p>
      </section>
    );

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-4">
        Popular Medical Camps
      </h2>
      <p className="text-base sm:text-xl font-semibold text-center text-gray-400 mb-8">
        Explore Events Aimed at Community Wellness
      </p>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {popularCamps.map((camp) => (
          <div
            key={camp._id}
            className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden flex flex-col"
          >
            <figure className="w-full h-48 overflow-hidden">
              <img
                src={camp.image}
                alt={camp.campName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </figure>
            <div className="flex-grow p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{camp.campName}</h3>
                <p className="text-sm mb-1">
                  <strong>Date & Time:</strong> {camp.dateTime}
                </p>
                <p className="text-sm mb-1">
                  <strong>Location:</strong> {camp.location}
                </p>
                <p className="text-sm mb-1">
                  <strong>Fees:</strong> ${camp.fees}
                </p>
                <p className="text-sm mb-1">
                  <strong>Healthcare Professional:</strong> {camp.healthcareProfessional}
                </p>
                <p className="text-sm">
                  <strong>Participants:</strong> {camp.participantCount ?? 0}
                </p>
              </div>
              <Link to={`/camp-details/${camp._id}`}>
                <button className="btn btn-sm btn-primary mt-4 w-full">View Details</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link to="/availableCamps" className="btn btn-primary btn-wide">
          See All Camps
        </Link>
      </div>
    </section>
  );
};

export default PopularCamps;
