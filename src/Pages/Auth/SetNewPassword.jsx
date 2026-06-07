// src/pages/auth/SetNewPassword.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import brandLogo from "../../assets/Logo.svg";
import { useSetNewPasswordMutation } from "../../redux/api/authApi";

const SetNewPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [SetNewPassword, { isLoading }] = useSetNewPasswordMutation();

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const resetCode = location.state?.resetCode || "";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // if (formData.newPassword.length < 8) {
    //   setError("Password must be at least 8 characters long");
    //   return;
    // }

    if (!email) {
      setError("Email is required. Please restart the password reset process.");
      return;
    }

    if (!resetCode) {
      setError(
        "Reset code is required. Please restart the password reset process."
      );
      return;
    }

    try {
      await SetNewPassword({
        email,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }).unwrap();
      navigate("/successful");
    } catch (error) {
      console.error("Failed to reset password:", error);
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <img
                src={brandLogo}
                alt="Brand Logo"
                className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2 text-center">
              Set New Password
            </h2>
            <p className="text-center text-sm sm:text-base text-gray-600">
              Set a new password to secure your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                name="newPassword"
                type="password"
                id="newPassword"
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full h-11 sm:h-12 px-3 border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-[#FFD1E8] focus:border-[#FFD1E8]"
                required
              />

              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1 mt-4"
              >
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-11 sm:h-12 px-3 border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-[#FFD1E8] focus:border-[#FFD1E8]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 sm:h-12 bg-[#007CCD] text-white px-4 rounded-lg cursor-pointer text-sm sm:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Setting Password..." : "Set Password"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full h-11 sm:h-12 px-4 rounded-lg border border-gray-300 flex items-center justify-center gap-2 cursor-pointer text-gray-700 text-sm sm:text-base hover:bg-gray-50 transition-colors"
            >
              <FiArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Login</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
