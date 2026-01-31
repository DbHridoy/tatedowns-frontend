import { useNavigate } from "react-router-dom";
import brandLogo from "../../assets/Logo.svg";
import tick from "../../assets/tick.svg";
import { FiArrowLeft } from "react-icons/fi";

function Successful() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10 sm:px-6">
      <div className="w-full mx-auto">
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
            <div className="flex justify-center">
              <img
                src={tick}
                alt="Tick"
                className="h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18"
              />
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xl sm:text-2xl font-semibold text-gray-800">
              Success!
            </p>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Your password has been set successfully.
            </p>
          </div>

          <button
            onClick={handleBackToLogin}
            className="w-full h-11 sm:h-12 flex justify-center items-center gap-2 text-white mt-8 px-4 rounded-lg bg-[#007CCD] cursor-pointer text-sm sm:text-base font-medium transition-colors"
          >
            <FiArrowLeft className="h-4 w-4" />
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Successful;
