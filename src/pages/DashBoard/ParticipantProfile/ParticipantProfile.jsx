import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ParticipantProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    contact: ""
  });

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/participants?email=${user.email}`) // make sure your API returns an array here
        .then((res) => {
          const data = res.data[0]; // take first participant from array
          setProfile(data);
          setFormData({
            name: data.participantName || "",
            image: data.image || "",
            contact: data.contact || ""
          });
        })
        .catch((err) => {
          console.error("Failed to load profile", err);
        });
    }
  }, [user, axiosSecure]);

  const handleUpdateClick = () => setIsEditing(true);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosSecure.put(`/participants/${profile._id}`, {
        participantName: formData.name,
        image: formData.image,
        contact: formData.contact
      });
      if (res.data.modifiedCount > 0) {
        setProfile((prev) => ({
          ...prev,
          participantName: formData.name,
          image: formData.image,
          contact: formData.contact
        }));
        Swal.fire("Updated!", "Profile updated successfully.", "success");
        setIsEditing(false);
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update profile.", "error");
    }
  };

  if (!profile) {
    return (
      <span className="loading loading-dots loading-lg"></span>
    );
  }

  return (
    <div className="w-full mx-auto mt-10 p-6  bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">My Profile</h2>

      <div className="flex flex-col items-center mb-6">
        <img
          src={
                  user?.photoURL
                    ? user.photoURL
                    : "https://i.ibb.co/2kRZKmW/default-avatar.png"
                }
          alt={profile.participantName}
          className="w-24 h-24 rounded-full border-4 border-green-600 mb-3 object-cover"
        />
        <p className="text-gray-800 text-xl font-semibold">{profile.participantName}</p>
        <p className="text-gray-700">{user.email}</p>
        <p className="text-gray-700">Contact: {profile.contact || "N/A"}</p>
      </div>

      <button
        onClick={handleUpdateClick}
        className="btn btn-outline btn-info w-full py-2 font-semibold hover:bg-green-700 hover:text-white transition duration-200 text-green-600"
      >
        Update
      </button>

      {/* Modal Form */}
      {isEditing && (
        <div className="fixed inset-0 backdrop-brightness-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <h3 className="text-xl font-bold mb-4 text-blue-700">Update Profile</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">Contact Number</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantProfile;
