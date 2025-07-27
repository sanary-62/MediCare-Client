import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import SearchBar from '../../SearchBar/SearchBar'; 

const ActiveOrganizers = () => {
  const axiosSecure = useAxiosSecure();
  const [organizers, setOrganizers] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    axiosSecure.get('/organizers?status=accept')
      .then(res => setOrganizers(res.data))
      .catch(err => console.error(err));
  }, [axiosSecure]);

  const filteredOrganizers = organizers.filter((org) => {
    const term = searchTerm.toLowerCase();
    return (
      org.name?.toLowerCase().includes(term) ||
      org.email?.toLowerCase().includes(term) ||
      org.region?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredOrganizers.length / limit);
  const startIndex = (page - 1) * limit;
  const currentOrganizers = filteredOrganizers.slice(startIndex, startIndex + limit);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-4xl text-green-700 font-bold mb-6 text-center">Active Organizers</h2>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search by name, email, or region"
      />

      <div className="overflow-x-auto mt-4">
        <table className="table table-zebra w-full text-center min-w-[600px] sm:min-w-full">
          <thead className="bg-base-200">
            <tr>
              <th className="whitespace-nowrap">#</th>
              <th className="whitespace-nowrap">Name</th>
              <th className="whitespace-nowrap">Email</th>
              <th className="whitespace-nowrap">Region</th>
              <th className="whitespace-nowrap">Phone</th>
            </tr>
          </thead>
          <tbody>
            {currentOrganizers.map((org, index) => (
              <tr key={org._id}>
                <td>{startIndex + index + 1}</td>
                <td>{org.name}</td>
                <td>{org.email}</td>
                <td>{org.region}</td>
                <td>{org.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
        <button
          className="btn btn-sm w-full sm:w-auto"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span className="btn btn-sm btn-disabled w-full sm:w-auto">{page}</span>
        <button
          className="btn btn-sm w-full sm:w-auto"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActiveOrganizers;
