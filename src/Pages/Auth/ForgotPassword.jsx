import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import brandLogo from "../../assets/Logo.svg";
import { useSendOtpMutation } from "../../redux/api/authApi";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [sendOtp,{isloading}] = useSendOtpMutation();

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleNext = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      console.error("Please enter your email address");
      return;
    }

    try {
      await sendOtp( email ).unwrap();
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      console.error("Failed to send reset code:", error);
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
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 text-center">
              Forgot Password
            </h2>
            <p className="text-sm sm:text-base text-center text-gray-600">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleNext} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 sm:h-12 px-3 border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-[#FFD1E8] focus:border-[#FFD1E8]"
                required
              />
            </div>

            {/* Next button */}
            <button
              type="submit"
              className="w-full h-11 sm:h-12 bg-[#007CCD] text-white px-4 rounded-lg cursor-pointer text-sm sm:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isloading}
            >
              {isloading ? 'Sending...' : 'Next'}
            </button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full h-11 sm:h-12 px-4 rounded-lg border border-gray-300 flex items-center justify-center gap-2 cursor-pointer text-gray-700 text-sm sm:text-base hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <FiArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Login</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
