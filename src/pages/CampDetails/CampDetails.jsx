import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

const CampDetails = () => {
  const { campId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/participants?email=${user.email}`)
        .then((res) => {
          if (res.data && res.data.camps && res.data.camps.length > 0) {
            setProfile(res.data.camps[0]);
          }
        })
        .catch((err) => {
          console.error("Failed to load participant profile", err);
        });
    }
  }, [user, axiosSecure]);

  const [camp, setCamp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    axiosSecure.get(`/camps/${campId}`).then((res) => setCamp(res.data));
  }, [axiosSecure, campId]);

  const handleJoin = async (data) => {
    if (!user) {
      Swal.fire("Unauthorized", "Please login to join the camp.", "warning");
      return;
    }

    const ageNum = Number(data.age);
    if (ageNum < 15) {
      Swal.fire("Invalid Age", "You must be at least 15 years old.", "error");
      return;
    }

    try {
      const existingRes = await axiosSecure.get(
        `/users/search?email=${user.email}`
      );
      console.log(existingRes);
      const alreadyJoined = existingRes.data?.camps?.find(
        (p) => String(p.campId) === String(camp._id)
      );

      if (alreadyJoined) {
        Swal.fire(
          "Already Joined",
          "You have already registered for this camp.",
          "info"
        );
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
        ...data,
      };

      const res = await axiosSecure.post("/participants", participantData);

      if (res.data.insertedId) {
        await axiosSecure.patch(`/camps/increment/${camp._id}`);

        Swal.fire(
          "Joined!",
          "You have successfully joined the camp.",
          "success"
        );
        setShowModal(false);
        reset();

        const updated = await axiosSecure.get(`/camps/${campId}`);
        setCamp(updated.data);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Could not join the camp.", "error");
    }
  };

  if (!camp)
    return <div className="text-center py-20 text-lg text-gray-700">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
      <img
        src={camp.image}
        alt={camp.campName}
        className="w-full h-60 sm:h-72 md:h-80 object-cover rounded-lg mb-6"
      />
      <h2 className="text-3xl font-bold mb-3 text-blue-600">{camp.campName}</h2>
      <p className="mb-1">
        <strong>Date & Time:</strong> {camp.dateTime}
      </p>
      <p className="mb-1">
        <strong>Location:</strong> {camp.location}
      </p>
      <p className="mb-1">
        <strong>Fees:</strong> ${camp.fees}
      </p>
      <p className="mb-1">
        <strong>Healthcare Professional:</strong> {camp.healthcareProfessional}
      </p>
      <p className="mb-1">
        <strong>Participants:</strong> {camp.participantCount}
      </p>
      <p className="mt-3 text-gray-700 whitespace-pre-line">{camp.description}</p>

      <button
        className="btn btn-primary mt-6 w-full sm:w-auto"
        onClick={() => {
          if (!user) {
            window.location.href = "/login";
          } else {
            setShowModal(true);
          }
        }}
      >
        Join Camp
      </button>

      {showModal && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-lg w-full p-4 sm:p-6">
            <h3 className="font-bold text-lg mb-4">Join {camp.campName}</h3>
            <form onSubmit={handleSubmit(handleJoin)} className="space-y-4">
              <input
                type="text"
                value={camp.campName}
                disabled
                className="input input-bordered w-full"
              />
              <input
                type="text"
                value={camp.fees}
                disabled
                className="input input-bordered w-full"
              />
              <input
                type="text"
                value={camp.location}
                disabled
                className="input input-bordered w-full"
              />
              <input
                type="text"
                value={camp.healthcareProfessional}
                disabled
                className="input input-bordered w-full"
              />

              <input
                type="text"
                value={
                  profile?.participantName ||
                  profile?.name ||
                  user?.displayName ||
                  ""
                }
                disabled
                className="input input-bordered w-full"
              />

              <input
                type="email"
                value={user?.email}
                disabled
                className="input input-bordered w-full"
              />

              <div>
                <label className="label font-medium">Age</label>
                <input
                  type="number"
                  {...register("age", {
                    required: "Age is required",
                    validate: (value) => {
                      const num = Number(value);
                      if (isNaN(num)) return "Age must be a number";
                      if (num < 15) return "You must be at least 15 years old";
                      return true;
                    },
                  })}
                  placeholder="Enter your age"
                  className="input input-bordered w-full"
                />
                {errors.age && (
                  <span className="text-red-500 text-sm">{errors.age.message}</span>
                )}
              </div>

              <div>
                <label className="label font-medium">Phone Number</label>
                <input
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^01[0-9]{9}$/,
                      message: "Phone number must be valid and start with 01",
                    },
                  })}
                  placeholder="01XXXXXXXXX"
                  className="input input-bordered w-full"
                  maxLength={11}
                />
                {errors.phone && (
                  <span className="text-red-500 text-sm">{errors.phone.message}</span>
                )}
              </div>

              <div>
                <label className="label font-medium">Gender</label>
                <select
                  {...register("gender", { required: "Gender is required" })}
                  className="select select-bordered w-full"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                {errors.gender && (
                  <span className="text-red-500 text-sm">{errors.gender.message}</span>
                )}
              </div>

              <div>
                <label className="label font-medium">Emergency Contact</label>
                <input
                  type="tel"
                  {...register("emergencyContact", {
                    required: "Emergency contact is required",
                    pattern: {
                      value: /^01[0-9]{9}$/,
                      message: "Emergency contact must be valid and start with 01",
                    },
                  })}
                  placeholder="01XXXXXXXXX"
                  className="input input-bordered w-full"
                  maxLength={11}
                />
                {errors.emergencyContact && (
                  <span className="text-red-500 text-sm">
                    {errors.emergencyContact.message}
                  </span>
                )}
              </div>

              <div className="modal-action flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="submit"
                  className="btn btn-success text-white bg-sky-700"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setShowModal(false);
                    reset();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default CampDetails;
