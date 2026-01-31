// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import mobile from "../../assets/images/mobile.png";
import glfLogo from "../../assets/logos/glfLogo.svg";
import bgImage from "../../assets/images/bg-image.jpg";
import golfClub from "../../assets/logos/golfClub.svg";
import golfer from "../../assets/logos/golfer.svg";
const RoleSelection = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedRole, setSelectedRole] = useState("club");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would verify credentials with your backend
      if (formData.email && formData.password) {
        const userData = {
          name: "John Doe",
          email: formData.email,
          role: "admin",
        };
        login(userData, "mock-jwt-token");
        navigate("/");
      } else {
        setError("Please fill in all fields");
      }
    } catch (err) {
      setError("Failed to sign in. Please check your credentials.");
    }

    setLoading(false);
  };

  const handleGoogleLogin = () => {};

  return (
    <div className="min-h-screen bg-white flex overflow-hidden text-[#5C526D]">
      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-8 bg-[url('/bgfill.png')] min-h-full bg-cover bg-center">
        <div className="w-full mx-auto">
          <div className=" shadow-lg rounded-lg p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-center mb-2">
                <img
                  src={glfLogo}
                  alt="Rai Logo"
                  className="h-[158px] w-[205px] object-contain"
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 text-center">
                Create and Account
              </h2>
              {/* <p className="text-sm sm:text-base text-center">
                Login to your account
              </p> */}
            </div>
            <div className="flex justify-center gap-12 mt-4 ">
                <div onClick={() => setSelectedRole("club")} className={ `text-white p-4  border ${selectedRole === "club" ? "bg-[#9D4C1D] " : "bg-white "} border-gray-300 rounded-md flex flex-col items-center  gap-4`}>
                  <img src={golfClub} alt="golfClub" />
                  <p className={`text-xl ${selectedRole === "club" ? "text-white" : "text-black"} w-full text-center `}>Club</p>
                </div>
                <div onClick={() => setSelectedRole("player")} className={ `text-white p-4 border ${selectedRole === "player" ? "bg-[#9D4C1D] " : "bg-white "} border-gray-300 rounded-md flex flex-col items-center gap-4`}>
                  <img src={golfer} alt="golfer" />
                  <p className={`text-xl ${selectedRole === "player" ? "text-white" : "text-black"} w-full text-center `}>Player</p>
                </div>
            </div>
            <div className="flex justify-center mt-6 w-full">
              <button
                onClick={() => navigate("/signup", { state: { role: selectedRole } })}
                className="bg-[#9D4C1D] text-white p-4 rounded-md w-full"
              >
                Continue
              </button>
            </div>

            {/* Sign up link */}
            <div className="text-center mt-6 font-semibold">
              <span>Already have an account? </span>
              <button
                onClick={() => navigate("/login")}
                className="text-[#9D4C1D] font-semibold text-sm cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Left side - Mobile mockup - Hidden on mobile, visible on large screens */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center px-4 md:px-8 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Shadow Overlay on Background */}
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

        {/* Content Above the Shadow */}
        <div className="relative z-10 flex flex-col items-center">
          <img
            src={mobile}
            alt="Decorative Art"
            className="h-[850px] w-[380px] rounded-2xl object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
