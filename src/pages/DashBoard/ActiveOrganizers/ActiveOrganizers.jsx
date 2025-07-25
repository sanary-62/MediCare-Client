
import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ActiveOrganizers = () => {
  const axiosSecure = useAxiosSecure();
  const [organizers, setOrganizers] = useState([]);

  useEffect(() => {
    axiosSecure.get('/organizers?status=accept')
      .then(res => setOrganizers(res.data))
      .catch(err => console.error(err));
  }, [axiosSecure]);

  return (
    <div className="p-4">
      <h2 className="text-4xl text-green-700 font-bold mb-6 text-center">Active Organizers</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-center">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {organizers.map((org, index) => (
              <tr key={org._id}>
                <td>{index + 1}</td>
                <td>{org.name}</td>
                <td>{org.email}</td>
                <td>{org.region}</td>
                <td>{org.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveOrganizers;
