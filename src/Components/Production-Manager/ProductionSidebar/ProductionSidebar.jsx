import { useState } from "react";
import {
  FiBarChart2,
  FiCalendar,
  FiChevronDown,
  FiHome,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import brandlogo from "../../../assets/Logo.svg";

const ProductionSidebar = () => {
  const [active, setActive] = useState("Home");

  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <FiHome className="w-5 h-5" />,
      label: "Home",
      Link: "/s/production-manager/production-home",
    },
    {
      icon: <FiCalendar className="w-5 h-5" />,
      label: "Job Scheduling",
      Link: "/s/production-manager/jobs",
    },
    {
      icon: <FiBarChart2 className="w-5 h-5" />,
      label: "Reports",
      Link: "/s/production-manager/production-report",
    },
    {
      icon: <FiSettings className="w-5 h-5" />,
      label: "Settings",
      Link: "/s/production-manager/production-settings",
    },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col px-2">
      {/* Logo */}
      <div className="flex justify-center items-center my-4">
        <img src={brandlogo} alt="logo" className="w-20 h-20 object-contain" />
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-150px)]">
        {menuItems.map((item) => (
          <div key={item.label} className="mb-1">
            {item.isDropdown ? (
              // Dropdown parent
              <div
                className={`flex justify-between items-center px-5 py-2 cursor-pointer transition-all ${
                  active === item.label
                    ? "bg-[#007CCD] text-white font-semibold"
                    : "text-black"
                }`}
                onClick={() =>
                  setActive(active === item.label ? "" : item.label)
                }
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <p>{item.label}</p>
                </div>
                <FiChevronDown
                  className={`${active === item.label ? "rotate-180" : ""}`}
                />
              </div>
            ) : (
              // Normal link
              <Link
                to={item.Link}
                className={`flex items-center gap-3 px-5 py-2 cursor-pointer transition-all ${
                  active === item.label
                    ? "bg-[#007CCD] text-white font-semibold"
                    : "text-black"
                }`}
                onClick={() => setActive(item.label)}
              >
                {item.icon}
                <p>{item.label}</p>
              </Link>
            )}

            {/* Subitems */}
            {item.isDropdown && active === item.label && (
              <div className="flex flex-col pl-8">
                {item.subItems?.map((subItem) => (
                  <Link
                    to={subItem.Link}
                    key={subItem.label}
                    className={`py-2 px-5 cursor-pointer my-1 rounded-lg transition-all ${
                      active === subItem.label
                        ? "bg-[#007CCD] text-black font-semibold"
                        : "text-white"
                    }`}
                    onClick={() => setActive(subItem.label)}
                  >
                    <p className="flex items-center gap-2">
                      {subItem.icon} {subItem.label}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="bg-primarycolor text-white w-full py-3 flex justify-center items-center cursor-pointer rounded-lg mt-4"
      >
        <FiLogOut className="text-xl" />
        <p className="ml-2">Log out</p>
      </button>
    </div>
  );
};

export default ProductionSidebar;
