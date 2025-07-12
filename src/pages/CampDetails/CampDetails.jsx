import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';

const CampDetails = () => {
  const { campId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [camp, setCamp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    phone: '',
    gender: '',
    emergencyContact: ''
  });

  useEffect(() => {
    axiosSecure.get(`/camps/${campId}`).then(res => setCamp(res.data));
  }, [axiosSecure, campId]);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

const handleJoin = async e => {
  e.preventDefault();

  if (!user) {
    Swal.fire('Unauthorized', 'Please login to join the camp.', 'warning');
    return;
  }

  try {
    // 🟡 Check if the user already joined this camp
    const existingRes = await axiosSecure.get(`/participants?email=${user.email}`);
    const alreadyJoined = existingRes.data.find(p => String(p.campId) === String(camp._id));

    if (alreadyJoined) {
      Swal.fire('Already Joined', 'You have already registered for this camp.', 'info');
      return;
    }

    const participantData = {
      campId: camp._id,
      campName: camp.campName,
      fees: camp.fees,
      location: camp.location,
      healthcareProfessional: camp.healthcareProfessional,
      participantName: user?.displayName,
      participantEmail: user?.email,
      ...formData
    };

    try {
      const res = await axiosSecure.post('/participants', participantData);

      if (res.data.insertedId) {
        await axiosSecure.patch(`/camps/increment/${camp._id}`);

        Swal.fire('Joined!', 'You have successfully joined the camp.', 'success');
        setShowModal(false);
        setFormData({ age: '', phone: '', gender: '', emergencyContact: '' });

        const updated = await axiosSecure.get(`/camps/${campId}`);
        setCamp(updated.data);
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Could not join the camp.', 'error');
    }

  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'An unexpected error occurred.', 'error');
  }
};






  if (!camp) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <img src={camp.image} alt={camp.campName} className="w-full h-72 object-cover rounded-lg mb-4" />
      <h2 className="text-3xl font-bold mb-2 text-blue-600">{camp.campName}</h2>
      <p><strong>Date & Time:</strong> {camp.dateTime}</p>
      <p><strong>Location:</strong> {camp.location}</p>
      <p><strong>Fees:</strong> ${camp.fees}</p>
      <p><strong>Healthcare Professional:</strong> {camp.healthcareProfessional}</p>
      <p><strong>Participants:</strong> {camp.participantCount}</p>
      <p className="mt-2 text-gray-700">{camp.description}</p>

      <button
  className="btn btn-primary mt-6"
  onClick={() => {
    if (!user) {
      // redirect to login
      window.location.href = "/login";
    } else {
      setShowModal(true);
    }
  }}
>
  Join Camp
</button>


      {/* Modal */}
      {showModal && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">Join {camp.campName}</h3>
            <form onSubmit={handleJoin} className="space-y-3">

              <input type="text" value={camp.campName} disabled className="input input-bordered w-full" />
              <input type="text" value={camp.fees} disabled className="input input-bordered w-full" />
              <input type="text" value={camp.location} disabled className="input input-bordered w-full" />
              <input type="text" value={camp.healthcareProfessional} disabled className="input input-bordered w-full" />

              <input type="text" value={user?.displayName} disabled className="input input-bordered w-full" />
              <input type="email" value={user?.email} disabled className="input input-bordered w-full" />

              <input
                type="number"
                name="age"
                placeholder="Your Age"
                required
                className="input input-bordered w-full"
                value={formData.age}
                onChange={handleChange}
              />
              <input
  type="tel"
  name="phone"
  placeholder="Phone Number"
  required
  className="input input-bordered w-full"
  value={formData.phone}
  onChange={handleChange}
  pattern="01[0-9]{9}"
  maxLength={11}
/>
              <select
                name="gender"
                required
                className="select select-bordered w-full"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="" disabled>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <input
  type="tel"
  name="emergencyContact"
  placeholder="Emergency Contact"
  required
  className="input input-bordered w-full"
  value={formData.emergencyContact}
  onChange={handleChange}
  pattern="01[0-9]{9}"
  maxLength={11}
/>

              <div className="modal-action">
                <button type="submit" className="btn btn-success text-white bg-sky-700 ">Submit</button>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default CampDetails;
