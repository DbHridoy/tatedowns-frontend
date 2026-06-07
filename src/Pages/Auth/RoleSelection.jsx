import { useState } from "react";
import { useNavigate } from "react-router-dom";
import brandLogo from "../../assets/Logo.svg";

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState("club");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex overflow-hidden text-[#5C526D]">
      <div className="flex-1 flex items-center justify-center px-4 md:px-8 min-h-full bg-[#f5f1ea] bg-cover bg-center">
        <div className="w-full max-w-xl mx-auto">
          <div className="shadow-lg rounded-lg p-6 sm:p-8 bg-white">
            <div className="mb-8">
              <div className="flex justify-center mb-2">
                <img
                  src={brandLogo}
                  alt="Brand Logo"
                  className="h-28 w-28 object-contain"
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 text-center">
                Choose your role
              </h2>
              <p className="text-sm sm:text-base text-center text-gray-500">
                Select how you want to continue.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
              {[
                {
                  key: "club",
                  title: "Club",
                  description: "Manage club-facing workflows and team activity.",
                },
                {
                  key: "player",
                  title: "Player",
                  description: "Continue with the player experience and tools.",
                },
              ].map((role) => (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => setSelectedRole(role.key)}
                  className={`rounded-md border p-5 text-left transition ${
                    selectedRole === role.key
                      ? "border-[#9D4C1D] bg-[#9D4C1D] text-white"
                      : "border-gray-300 bg-white text-black"
                  }`}
                >
                  <p className="text-xl font-semibold">{role.title}</p>
                  <p
                    className={`mt-2 text-sm ${
                      selectedRole === role.key ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {role.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex justify-center mt-6 w-full">
              <button
                onClick={() => navigate("/signup", { state: { role: selectedRole } })}
                className="bg-[#9D4C1D] text-white p-4 rounded-md w-full"
              >
                Continue
              </button>
            </div>

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
      <div className="hidden lg:flex flex-1 items-center justify-center px-10 bg-[#1f2937] text-white">
        <div className="max-w-md">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">
            Tate&apos;s Down
          </p>
          <h3 className="mt-4 text-4xl font-semibold leading-tight">
            Centralized workflows for sales, operations, and reporting.
          </h3>
          <p className="mt-4 text-base text-white/70">
            Pick a role and continue into the part of the dashboard you need.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
