import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const AddCamp = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const campData = {
      ...data,
      participantCount: 0, 
    };

    try {
      const res = await fetch("http://localhost:5000/camps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campData),
      });

      const result = await res.json();
      console.log("Server response:", result); 

      if (result.insertedId) {
        Swal.fire("Success!", "Camp added successfully!", "success");
        reset();
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to add camp", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Add A Camp</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("campName", { required: "Camp Name is required" })}
          className="input input-bordered w-full"
          placeholder="Camp Name"
        />
        {errors.campName && <p className="text-red-500">{errors.campName.message}</p>}

        <input
          {...register("image", { required: "Image URL is required" })}
          className="input input-bordered w-full"
          placeholder="Image URL"
        />
        {errors.image && <p className="text-red-500">{errors.image.message}</p>}

        <input
          type="number"
          {...register("fees", { required: "Camp Fees are required" })}
          className="input input-bordered w-full"
          placeholder="Camp Fees"
        />
        {errors.fees && <p className="text-red-500">{errors.fees.message}</p>}

        <input
          type="datetime-local"
          {...register("dateTime", { required: "Date and Time are required" })}
          className="input input-bordered w-full"
        />
        {errors.dateTime && <p className="text-red-500">{errors.dateTime.message}</p>}

        <input
          {...register("location", { required: "Location is required" })}
          className="input input-bordered w-full"
          placeholder="Location"
        />
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}

        <input
          {...register("healthcareProfessional", { required: "Name is required" })}
          className="input input-bordered w-full"
          placeholder="Healthcare Professional Name"
        />
        {errors.healthcareProfessional && (
          <p className="text-red-500">{errors.healthcareProfessional.message}</p>
        )}

        <textarea
          {...register("description", { required: "Description is required" })}
          className="textarea textarea-bordered w-full"
          placeholder="Camp Description"
        ></textarea>
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        <button className="btn btn-primary w-full" type="submit">
          Add Camp
        </button>
      </form>
    </div>
  );
};

export default AddCamp;
