import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const UpdateCamp = () => {
  const { campId } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [campData, setCampData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Load camp data
  useEffect(() => {
    axiosSecure.get(`/camps/${campId}`)
      .then((res) => {
        const camp = res.data;

        // Format date for input type=date: 'YYYY-MM-DD'
        if (camp.date) {
          const d = new Date(camp.date);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          camp.date = `${year}-${month}-${day}`;
        }

        // If time is stored, keep it; else default to empty string
        camp.time = camp.time || "";

        setCampData(camp);
        reset(camp); // pre-fill form
      })
      .catch((error) => {
        console.error("Failed to fetch camp data:", error);
        Swal.fire("Error", "Failed to load camp data", "error");
      });
  }, [axiosSecure, campId, reset]);

  const onSubmit = async (data) => {
    console.log("Submitting update:", data);

    const { _id, participantCount, dateTime, ...sanitizedData } = data;

    try {
      const response = await axiosSecure.patch(`/update-camp/${campId}`, sanitizedData);
      if (response.data.modifiedCount > 0) {
        Swal.fire("Updated!", "Camp details updated successfully.", "success");
        navigate("/dashboard/manageCamps");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update camp", "error");
    }
  };

  if (!campData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
      <h2 className="text-3xl sm:text-4xl text-blue-700 font-bold mb-6 text-center">
        Update Camp
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-1 font-semibold">Camp Name</label>
          <input
            type="text"
            {...register("campName", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.campName && (
            <span className="text-red-500 text-sm mt-1 block">
              This field is required
            </span>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Location</label>
          <input
            type="text"
            {...register("location", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.location && (
            <span className="text-red-500 text-sm mt-1 block">
              This field is required
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Date</label>
            <input
              type="date"
              {...register("date", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.date && (
              <span className="text-red-500 text-sm mt-1 block">
                This field is required
              </span>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold">Time</label>
            <input
              type="time"
              {...register("time", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.time && (
              <span className="text-red-500 text-sm mt-1 block">
                This field is required
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Healthcare Professional</label>
          <input
            type="text"
            {...register("healthcareProfessional", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.healthcareProfessional && (
            <span className="text-red-500 text-sm mt-1 block">
              This field is required
            </span>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Camp Fees</label>
          <input
            type="number"
            {...register("fees", { required: true, min: 0 })}
            className="input input-bordered w-full"
          />
          {errors.fees && (
            <span className="text-red-500 text-sm mt-1 block">
              Please enter a valid fee
            </span>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Camp Image URL</label>
          <input
            type="text"
            {...register("image")}
            className="input input-bordered w-full"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full mt-2 sm:mt-4">
          Update Camp
        </button>
      </form>
    </div>
  );
};

export default UpdateCamp;
