import React from "react";

const AboutUs = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        About Us
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-12">
        <img
          src="https://i.postimg.cc/4NzXnCXw/About-1.jpg"
          alt="Our Mission"
          className="rounded-lg shadow-md w-full h-auto object-cover"
        />
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">Our Mission</h2>
          <p className="text-gray-700">
            At <strong>MediCare</strong>, we believe access to healthcare should
            be simple, affordable, and available to everyone. Our mission is to
            organize free and low-cost medical camps across communities, connecting
            certified healthcare professionals with individuals who need it most.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">What We Do</h2>
          <p className="text-gray-700">
            Our platform makes it easy for healthcare providers to set up camps, 
            and for users to discover, join, and benefit from a wide range of 
            medical services — including free check-ups, diagnostics, vaccinations, 
            awareness programs, and more.
          </p>
        </div>
        <img
          src="https://i.postimg.cc/VkmmC76w/team-doctors-standing-corridor.jpg"
          alt="What We Do"
          className="rounded-lg shadow-md w-full h-auto object-cover"
        />
      </div>

      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-blue-600">Our Core Values</h2>
        <ul className="text-gray-700 space-y-2">
          <li> Compassionate Care</li>
          <li> Health Equity & Accessibility</li>
          <li> Community Engagement</li>
          <li> Transparency & Trust</li>
        </ul>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">
          Meet the Team
        </h2>
        <p className="text-gray-700">
          We are a passionate team of developers, doctors, and volunteers united by 
          a shared goal: to make healthcare outreach easier and more impactful using technology.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
