import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import SearchBar from '../../SearchBar/SearchBar';

const PendingOrganizers = () => {
  const axiosSecure = useAxiosSecure();
  const [organizers, setOrganizers] = useState([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    axiosSecure
      .get(`/organizers?status=pending&page=${page}&limit=${limit}`)
      .then((res) => {
        const data = res.data;

        // Check if data is an array or an object with { organizers, totalPages }
        if (Array.isArray(data)) {
          setOrganizers(data);
          setTotalPages(1); // Default 1 page if no pagination info
        } else if (data.organizers) {
          setOrganizers(data.organizers);
          setTotalPages(data.totalPages || 1);
        } else {
          setOrganizers([]);
          setTotalPages(1);
        }
      })
      .catch((err) => {
        console.error(err);
        setOrganizers([]);
      });
  }, [axiosSecure, page]);

  const handleDecision = (id, status, email) => {
    Swal.fire({
      title: `Are you sure to ${status} this organizer?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
      email,
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/organizers/${id}`, { status })
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              setOrganizers((prev) => prev.filter((org) => org._id !== id));
              Swal.fire('Success!', `Organizer ${status}ed`, 'success');
            }
          });
      }
    });
  };

  const filteredOrganizers = organizers.filter((org) => {
    const term = searchTerm.toLowerCase();
    const name = (org.participantName || org.name || '').toLowerCase();
    const email = (org.email || '').toLowerCase();
    const region = (org.region || '').toLowerCase();
    const phone = (org.phone || '').toLowerCase();
    return (
      name.includes(term) ||
      email.includes(term) ||
      region.includes(term) ||
      phone.includes(term)
    );
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h2 className="text-4xl text-blue-700 font-bold mb-6 text-center">
        Pending Organizers
      </h2>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search by name, email, region or phone"
      />

      <div className="overflow-x-auto mt-4 shadow-lg rounded-lg">
        <table className="table table-zebra w-full min-w-[600px] text-center">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrganizers.length > 0 ? (
              filteredOrganizers.map((org, index) => (
                <tr key={org._id}>
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td>
                    {org.participantName?.trim() ||
                      org.name?.trim() ||
                      'Anonymous'}
                  </td>
                  <td>{org.email}</td>
                  <td>{org.region}</td>
                  <td>{org.phone}</td>
                  <td className="flex flex-wrap justify-center gap-2">
                    <button
                      className="btn bg-blue-700 text-white btn-sm btn-info"
                      onClick={() => setSelectedOrganizer(org)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-sm text-white bg-green-700 btn-success"
                      onClick={() =>
                        handleDecision(org._id, 'accept', org.email)
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-sm text-white bg-red-700 btn-error"
                      onClick={() =>
                        handleDecision(org._id, 'cancelled', org.email)
                      }
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500">
                  No pending organizers found.
                </td>
              </tr>
            )}
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

      {/* Organizer Info Modal */}
      {selectedOrganizer && (
        <dialog open className="modal">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-blue-600 text-2xl mb-2">
              Organizer Details
            </h3>
            <p>
              <strong>Name:</strong>{' '}
              {selectedOrganizer.participantName?.trim() ||
                selectedOrganizer.name?.trim() ||
                'Anonymous'}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrganizer.email}
            </p>
            <p>
              <strong>Age:</strong> {selectedOrganizer.age}
            </p>
            <p>
              <strong>Region:</strong> {selectedOrganizer.region}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrganizer.phone}
            </p>
            <p>
              <strong>Nationality:</strong> {selectedOrganizer.nationality}
            </p>
            <p>
              <strong>Motivation:</strong> {selectedOrganizer.motivation}
            </p>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setSelectedOrganizer(null)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PendingOrganizers;
