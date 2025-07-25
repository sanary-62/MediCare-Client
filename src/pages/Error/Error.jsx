import React from "react";
import Lottie from "lottie-react";
import errorLottie from "../../assets/Lotties/Page Not Found 404.json";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center px-4"
      style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
    >
      <Lottie
        style={{
          width: "100vw",
          height: "80vh",
        }}
        animationData={errorLottie}
        loop={true}
      />

      <Link
        to="/"
        className=" inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Error;
