import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "typewriter-effect";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Organized Medical Camps",
      subtitle: "Easily manage and schedule medical camps",
      buttonText: "See All Camps",
      link: "/availableCamps",
      bgColor: "bg-[#81C784]",
      textColor: "text-white",
      image:
        "https://i.postimg.cc/QdmBHCT3/group-different-people-volunteering-foodbank.jpg",
    },
    {
      title: "Register Participants",
      subtitle: "Streamline patient registration process",
      buttonText: "Register Now",
      link: "/register-participant",
      bgColor: "bg-[#64B5F6]",
      textColor: "text-white",
      image:
        "https://i.postimg.cc/1X3w3Fvb/medium-shot-nurse-doctor-checking-patient.jpg",
    },
    {
      title: "Professional Doctors",
      subtitle: "Connect with expert healthcare pros",
      buttonText: "Meet Doctors",
      link: "/doctors",
      bgColor: "bg-[#FFF176]",
      textColor: "text-white",
      image:
        "https://i.postimg.cc/PrkNyYbH/team-young-specialist-doctors-standing-corridor-hospital.jpg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden bg-[#F9FAFB] mt-16 px-20 py-16">
      {/* Background image with overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
          <div
            className={`absolute inset-0 ${slides[currentSlide].bgColor} opacity-80`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-6 z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${slides[currentSlide].textColor}`}
            >
              <Typewriter
                options={{
                  strings: [slides[currentSlide].title],
                  autoStart: true,
                  loop: false,
                  delay: 50,
                  deleteSpeed: 0,
                  cursor: "",
                }}
              />
            </h1>
            <p
              className={`text-xl md:text-2xl mb-8 ${slides[currentSlide].textColor} font-medium`}
            >
              <Typewriter
                options={{
                  strings: [slides[currentSlide].subtitle],
                  autoStart: true,
                  delay: 30,
                  deleteSpeed: 0,
                  cursor: "",
                }}
              />
            </p>
            <Link
              to={slides[currentSlide].link}
              className="inline-block px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 bg-white text-gray-800 hover:bg-gray-100"
            >
              {slides[currentSlide].buttonText}
            </Link>
          </motion.div>

          {/* Right side - Image cards */}
          <div className="hidden lg:block relative h-96">
            <AnimatePresence>
              {slides.map((slide, index) => (
                <motion.div
                  key={index}
                  className={`absolute inset-0 bg-white rounded-xl shadow-2xl overflow-hidden ${
                    index === currentSlide ? "z-30" : "z-20"
                  }`}
                  initial={{
                    opacity: 0,
                    x:
                      index === currentSlide
                        ? 100
                        : index > currentSlide
                        ? 200
                        : -200,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: index === currentSlide ? 1 : 0.7,
                    x:
                      index === currentSlide
                        ? 0
                        : index > currentSlide
                        ? 100
                        : -100,
                    scale: index === currentSlide ? 1 : 0.9,
                  }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div
                    className={`absolute inset-0 ${slide.bgColor} opacity-20`}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={`indicator-${index}`}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
