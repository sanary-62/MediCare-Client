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
        
        const sorted = res.data
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
      <h2 className="text-4xl font-bold text-center text-blue-800 mb-6">
        Popular Medical Camps
      </h2>
      <p className="text-xl font-semibold text-center text-gray-400 mb-10">Explore Events Aimed at Community Wellness</p>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {popularCamps.map((camp) => (
          <div
            key={camp._id}
            className="card bg-base-100 shadow-lg border border-gray-200 rounded-lg overflow-hidden"
          >
            <figure>
              <img
                src={camp.image}
                alt={camp.campName}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            </figure>
            <div className="card-body p-5">
              <h3 className="card-title text-xl font-semibold">{camp.campName}</h3>
              <p>
                <strong>Date & Time:</strong> {camp.dateTime}
              </p>
              <p>
                <strong>Location:</strong> {camp.location}
              </p>
              <p>
                <strong>Fees:</strong> ${camp.fees}
              </p>
              <p>
                <strong>Healthcare Professional:</strong> {camp.healthcareProfessional}
              </p>
              <p>
                <strong>Participants:</strong> {camp.participantCount ?? 0}
              </p>
              <Link to={`/camp-details/${camp._id}`}>
  <button className="btn btn-sm btn-primary mt-3">View Details</button>
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
