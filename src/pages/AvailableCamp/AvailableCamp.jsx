import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AvailableCamp = () => {
  const axiosSecure = useAxiosSecure();
  const [camps, setCamps] = useState([]);
  const [filteredCamps, setFilteredCamps] = useState([]);
  const [layoutCols, setLayoutCols] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");

  useEffect(() => {
    axiosSecure
      .get("/camps")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setCamps(data);
        setFilteredCamps(data);
      })
      .catch((err) => {
        console.error("Error fetching camps:", err);
      });
  }, [axiosSecure]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = Array.isArray(camps)
      ? camps.filter(
          (camp) =>
            camp.campName.toLowerCase().includes(term) ||
            camp.location.toLowerCase().includes(term) ||
            camp.healthcareProfessional.toLowerCase().includes(term)
        )
      : [];

    setFilteredCamps(filtered);
  }, [searchTerm, camps]);

  useEffect(() => {
    axiosSecure
      .get("/camps?page=1&limit=100")
      .then((res) => {
        console.log(" Received data from /camps:", res.data);
        const data = res.data.camps || [];
        setCamps(data);
        setFilteredCamps(data);
      })
      .catch((err) => {
        console.error(" Fetching error:", err);
      });
  }, [axiosSecure]);

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8 text-blue-800">
        Available Camps
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, location, or doctor"
          className="input input-bordered w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="select select-bordered w-full md:w-auto"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="registered">Most Registered</option>
          <option value="fees">Camp Fees</option>
          <option value="name">Alphabetical (Name)</option>
        </select>

        <button
          className="btn btn-outline p-2 w-full md:w-auto flex justify-center"
          onClick={() => setLayoutCols(layoutCols === 3 ? 2 : 3)}
          title="Toggle Layout"
        >
          {layoutCols === 3 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect
                x="3"
                y="4"
                width="8"
                height="16"
                strokeWidth="2"
                stroke="currentColor"
              />
              <rect
                x="13"
                y="4"
                width="8"
                height="16"
                strokeWidth="2"
                stroke="currentColor"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect
                x="2"
                y="4"
                width="5"
                height="16"
                strokeWidth="2"
                stroke="currentColor"
              />
              <rect
                x="9.5"
                y="4"
                width="5"
                height="16"
                strokeWidth="2"
                stroke="currentColor"
              />
              <rect
                x="17"
                y="4"
                width="5"
                height="16"
                strokeWidth="2"
                stroke="currentColor"
              />
            </svg>
          )}
        </button>
      </div>

      <div
        className={`grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-${layoutCols}`}
      >
        {Array.isArray(filteredCamps) &&
          filteredCamps.map((camp) => (
            <div
              key={camp._id}
              className="card bg-base-100 shadow-md border border-gray-200 flex flex-col"
            >
              <figure className="h-48 w-full overflow-hidden rounded-t-lg">
                <img
                  src={camp.image}
                  alt={camp.campName}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body flex flex-col flex-grow">
                <h2 className="card-title">{camp.campName}</h2>
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
                  <strong>Healthcare Pro:</strong> {camp.healthcareProfessional}
                </p>
                <p>
                  <strong>Participants:</strong> {camp.participantCount}
                </p>
                <p className="text-sm text-gray-700 flex-grow">{camp.description}</p>

                <Link to={`/camp-details/${camp._id}`}>
                  <button className="btn btn-sm btn-primary mt-3 w-full md:w-auto">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AvailableCamp;
