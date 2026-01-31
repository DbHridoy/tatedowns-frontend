import { FiPlus } from "react-icons/fi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserRole } from "../../redux/slice/authSlice";

function FAB() {
  const role = useSelector(selectUserRole);
  const navigate = useNavigate();
  const [fabOpen, setFabOpen] = useState(false);

  const toggleFab = () => setFabOpen((prev) => !prev);

  // Navigate and close FAB
  const handleClick = (path) => {
    navigate(path);
    setFabOpen(false);
  };

  // Hide FAB for Production Manager only
  if (role === "Production Manager") {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-50 space-y-3">
      {/* Expanded Buttons */}
      {fabOpen && (
        <div className="flex flex-col items-end space-y-3 mb-2">
          {/* Add Client button for Sales Rep and Admin */}
          {(role === "Sales Rep" || role === "Admin") && (
            <button
              onClick={() =>
                handleClick(
                  role === "Admin" ? `/admin/add-clients` : `/sales-rep/add-client`
                )
              }
              className="flex items-center justify-center w-48 p-2 h-12 rounded-2xl bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition"
            >
              Add Client
            </button>
          )}

          {/* Sales Rep specific actions */}
          {role === "Sales Rep" && (
            <>
              <button
                onClick={() => handleClick(`/sales-rep/add-new-quote`)}
                className="flex items-center justify-center w-48 p-2 h-12 rounded-2xl bg-green-500 text-white shadow-lg hover:bg-green-600 transition"
              >
                Add Quote
              </button>
              <button
                onClick={() => handleClick(`/sales-rep/add-job`)}
                className="flex items-center justify-center w-48 p-2 h-12 rounded-2xl bg-red-500 text-white shadow-lg hover:bg-red-600 transition"
              >
                Add Job
              </button>
            </>
          )}

          {/* Admin could have additional FAB buttons if needed */}
        </div>
      )}

      {/* Main FAB */}
      <button
        className={`flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-transform duration-300 ${
          fabOpen ? "rotate-45" : ""
        }`}
        onClick={toggleFab}
      >
        <FiPlus className="text-2xl" />
      </button>
    </div>
  );
}

export default FAB;
