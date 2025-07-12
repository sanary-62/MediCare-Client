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
        setCamps(res.data);
        setFilteredCamps(res.data);
      })
      .catch((err) => {
        console.error("Error fetching camps:", err);
      });
  }, [axiosSecure]);

  
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = camps.filter(
      (camp) =>
        camp.campName.toLowerCase().includes(term) ||
        camp.location.toLowerCase().includes(term) ||
        camp.healthcareProfessional.toLowerCase().includes(term)
    );
    setFilteredCamps(filtered);
  }, [searchTerm, camps]);

  
  useEffect(() => {
    let sorted = [...filteredCamps];

    if (sortType === "registered") {
      sorted.sort((a, b) => b.participantCount - a.participantCount);
    } else if (sortType === "fees") {
      sorted.sort((a, b) => parseFloat(a.fees) - parseFloat(b.fees));
    } else if (sortType === "name") {
      sorted.sort((a, b) => a.campName.localeCompare(b.campName));
    }

    setFilteredCamps(sorted);
  }, [sortType]);

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8 text-blue-600">
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
          className="select select-bordered"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="registered">Most Registered</option>
          <option value="fees">Camp Fees</option>
          <option value="name">Alphabetical (Name)</option>
        </select>

        
        <button
  className="btn btn-outline p-2"
  onClick={() => setLayoutCols(layoutCols === 3 ? 2 : 3)}
  title="Toggle Layout"
>
  {layoutCols === 3 ? (
    
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="3" y="4" width="8" height="16" strokeWidth="2" stroke="currentColor" />
      <rect x="13" y="4" width="8" height="16" strokeWidth="2" stroke="currentColor" />
    </svg>
  ) : (
    
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="2" y="4" width="5" height="16" strokeWidth="2" stroke="currentColor" />
      <rect x="9.5" y="4" width="5" height="16" strokeWidth="2" stroke="currentColor" />
      <rect x="17" y="4" width="5" height="16" strokeWidth="2" stroke="currentColor" />
    </svg>
  )}
</button>

      </div>

      
      <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-${layoutCols}`}>
        {filteredCamps.map((camp) => (
          <div key={camp._id} className="card bg-base-100 shadow-md border border-gray-200">
            <figure>
              <img
                src={camp.image}
                alt={camp.campName}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body">
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
              <p className="text-sm text-gray-700">{camp.description}</p>

             
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

export default AvailableCamp;
