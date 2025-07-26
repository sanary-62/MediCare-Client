import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const PendingOrganizers = () => {
  const axiosSecure = useAxiosSecure();
  const [organizers, setOrganizers] = useState([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);

  useEffect(() => {
    axiosSecure.get('/organizers?status=pending')
      .then(res => setOrganizers(res.data))
      .catch(err => console.error(err));
  }, [axiosSecure]);

  const handleDecision = (id, status, email) => {
    Swal.fire({
      title: `Are you sure to ${status} this organizer?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`, email
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/organizers/${id}`, { status })
          .then(res => {
            if (res.data.modifiedCount > 0) {
              setOrganizers(prev => prev.filter(org => org._id !== id));
              Swal.fire('Success!', `Organizer ${status}ed`, 'success');
            }
          });
      }
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-4xl text-blue-700 font-bold mb-6 text-center">Pending Organizers</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-center">
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
            {organizers.map((org, index) => (
              <tr key={org._id}>
                <td>{index + 1}</td>
               <td>{org.participantName?.trim() || org.name?.trim() || 'Anonymous'}</td>


                <td>{org.email}</td>
                <td>{org.region}</td>
                <td>{org.phone}</td>
                <td className="flex gap-2 justify-center">
                  <button className="btn bg-blue-700 text-white btn-sm btn-info" onClick={() => setSelectedOrganizer(org)}>View</button>
                  <button className="btn btn-sm text-white bg-green-700 btn-success" onClick={() => handleDecision(org._id, 'accept', org.email)}>Accept</button>
                  <button className="btn btn-sm text-white bg-red-700 btn-error" onClick={() => handleDecision(org._id, 'cancelled', org.email)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Organizer Info Modal */}
      {selectedOrganizer && (
        <dialog open className="modal">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-blue-600 text-2xl mb-2">Organizer Details</h3>
           <p><strong>Name:</strong> {selectedOrganizer.participantName?.trim() || selectedOrganizer.name?.trim() || 'Anonymous'}</p>


            <p><strong>Email:</strong> {selectedOrganizer.email}</p>
            <p><strong>Age:</strong> {selectedOrganizer.age}</p>
            <p><strong>Region:</strong> {selectedOrganizer.region}</p>
            <p><strong>Phone:</strong> {selectedOrganizer.phone}</p>
            <p><strong>Nationality:</strong> {selectedOrganizer.nationality}</p>
            <p><strong>Motivation:</strong> {selectedOrganizer.motivation}</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedOrganizer(null)}>Close</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PendingOrganizers;
