import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";

const UpcomingCamps = () => {
  const axiosSecure = useAxiosSecure();
  const [upcomingCamps, setUpcomingCamps] = useState([]);

  useEffect(() => {
  axiosSecure.get("/camps")
    .then(res => {
      console.log("Camps data:", res.data); // ✅ Add this
      const today = new Date();

      const filtered = res.data
        .filter(camp => new Date(camp.date || camp.dateTime) > today)

        .sort((a, b) => new Date(a.date || a.dateTime) - new Date(b.date || b.dateTime))

        .slice(0, 3);

      setUpcomingCamps(filtered);
    })
    .catch(err => console.error("Failed to fetch camps", err));
}, [axiosSecure]);


  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-center text-blue-800 mb-6">
        Upcoming Camps
      </h2>
      <p className="text-xl font-semibold text-center text-gray-400 mb-10">Discover the upcoming camps for Community Wellness</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {upcomingCamps.map((camp) => (
          <div key={camp._id} className="card bg-base-100 shadow-md border border-gray-200 hover:shadow-xl transition">
            <figure>
              <img src={camp.image} alt={camp.campName} className="h-52 w-full object-cover" />
            </figure>
            <div className="card-body">
              <h3 className="card-title text-lg font-semibold text-blue-800">{camp.campName}</h3>
              <p className="text-sm text-gray-600">{camp.description?.slice(0, 100)}...</p>
              <p className="text-sm mt-2">
                <span className="font-semibold text-gray-700">Date:</span> {new Date(camp.date || camp.dateTime).toLocaleDateString()}

              </p>
              <p className="text-sm">
                <span className="font-semibold text-gray-700">Location:</span> {camp.location}
              </p>
               <Link to={`/camp-details/${camp._id}`}>
    <button className="btn btn-sm btn-primary mt-3">View Details</button>
  </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingCamps;
