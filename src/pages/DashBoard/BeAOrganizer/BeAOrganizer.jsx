import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';

const bangladeshDistricts = [
  'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal',
  'Sylhet', 'Rangpur', 'Mymensingh', 'Cumilla', 'Narayanganj',
  'Gazipur', 'Cox’s Bazar', 'Jessore', 'Bogra', 'Pabna'
];

const BeAOrganizer = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = data => {
    const organizerInfo = {
      name: user?.displayName || '',
      email: user?.email || '',
      ...data,
    };

    console.log('Organizer Application:', organizerInfo);
    // send to backend if needed
    reset();
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-base-200 rounded-xl shadow-lg mt-10 mb-10">
      <h2 className="text-4xl font-bold text-center mb-6 text-blue-700">Become an Organizer</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label font-medium">Name</label>
          <input
            type="text"
            value={user?.displayName || ''}
            readOnly
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="label font-medium">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            readOnly
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
  <label className="label font-medium">Age</label>
  <input
    type="number"
   {...register("age", {
  required: "Age is required",
  validate: value => value >= 18 || "You must be at least 18 years old"
})}

    placeholder="Enter your age"
    className="input input-bordered w-full"
  />
  {errors.age && <span className="text-red-500 text-sm">{errors.age.message}</span>}
</div>


        <div>
          <label className="label font-medium">Region</label>
          <select
            {...register("region", { required: true })}
            className="select select-bordered w-full"
            defaultValue=""
          >
            <option value="" disabled>Select your district</option>
            {bangladeshDistricts.map((district, idx) => (
              <option key={idx} value={district}>{district}</option>
            ))}
          </select>
          {errors.region && <span className="text-red-500 text-sm">Region is required</span>}
        </div>

        <div>
          <label className="label font-medium">Phone Number</label>
          <input
            type="tel"
            {...register("phone", { required: true })}
            placeholder="01XXXXXXXXX"
            className="input input-bordered w-full"
          />
          {errors.phone && <span className="text-red-500 text-sm">Phone number is required</span>}
        </div>

        <div>
          <label className="label font-medium">Nationality</label>
          <input
            type="text"
            {...register("nationality", { required: true })}
            placeholder="e.g., Bangladeshi"
            className="input input-bordered w-full"
          />
          {errors.nationality && <span className="text-red-500 text-sm">Nationality is required</span>}
        </div>

        <div>
          <label className="label font-medium">Why do you want to be an organizer?</label>
          <textarea
            {...register("motivation", { required: true })}
            placeholder="Write a short motivation..."
            className="textarea textarea-bordered w-full"
            rows={4}
          />
          {errors.motivation && <span className="text-red-500 text-sm">Motivation is required</span>}
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary px-10">
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeAOrganizer;
