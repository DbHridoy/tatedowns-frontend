import {
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiCheckSquare,
  FiFileText,
  FiGrid,
  FiHome,
  FiSettings,
  FiSliders,
  FiTruck,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../redux/api/authApi";
import { logout, selectUserRole } from "../redux/slice/authSlice";
import brandlogo from "../assets/Logo.svg";
import { FiLogOut } from "react-icons/fi";
import { userApi } from "../redux/api/userApi";

export const menuConfig = {
  "Sales Rep": [
    {
      icon: <FiGrid className="w-5 h-5" />,
      label: "Home",
      Link: "/sales-rep/home",
    },
    {
      icon: <FiUsers className="w-5 h-5" />,
      label: "Clients",
      Link: "/sales-rep/clients",
    },
    {
      icon: <FiFileText className="w-5 h-5" />,
      label: "Quotes",
      Link: "/sales-rep/quotes",
    },
    {
      icon: <FiBriefcase className="w-5 h-5" />,
      label: "Jobs",
      Link: "/sales-rep/jobs",
    },
    {
      icon: <FiBarChart2 className="w-5 h-5" />,
      label: "Reports",
      Link: "/sales-rep/reports",
    },
    {
      icon: <FiTruck className="w-5 h-5" />,
      label: "Mileage Log",
      Link: "/sales-rep/mileage-log",
    },
    {
      icon: <FiSettings className="w-5 h-5" />,
      label: "Settings",
      Link: "/sales-rep/settings",
    },
  ],

  "Production Manager": [
    {
      icon: <FiHome className="w-5 h-5" />,
      label: "Home",
      Link: "/production-manager/home",
    },
    {
      icon: <FiCalendar className="w-5 h-5" />,
      label: "Jobs",
      Link: "/production-manager/jobs",
    },
    {
      icon: <FiBriefcase className="w-5 h-5" />,
      label: "My Jobs",
      Link: "/production-manager/my-jobs",
    },
    // {
    //   icon: <CiHome className="w-5 h-5" />,
    //   label: "Reports",
    //   Link: "/production-manager/reports",
    // },
    {
      icon: <FiSettings className="w-5 h-5" />,
      label: "Settings",
      Link: "/production-manager/settings",
    },
  ],

  Admin: [
    {
      icon: <FiGrid className="w-5 h-5" />,
      label: "Dashboard",
      Link: "/admin/dashboard",
    },
    {
      icon: <FiUsers className="w-5 h-5" />,
      label: "Clients",
      Link: "/admin/clients",
    },
    {
      icon: <FiFileText className="w-5 h-5" />,
      label: "Quotes",
      Link: "/admin/quotes",
    },
    {
      icon: <FiBriefcase className="w-5 h-5" />,
      label: "Jobs",
      Link: "/admin/jobs",
    },
    {
      icon: <FiCheckSquare className="w-5 h-5" />,
      label: "Approvals Center",
      Link: "/admin/approvals-center",
    },
    // {
    //   icon: <IoNewspaper className="w-5 h-5" />,
    //   label: "Reports",
    //   Link: "/admin/reports",
    // },
    {
      icon: <FiUserCheck className="w-5 h-5" />,
      label: "User Management",
      Link: "/admin/user-management",
    },
    {
      icon: <FiSliders className="w-5 h-5" />,
      label: "Parameters",
      Link: "/admin/parameters",
    },
    {
      icon: <FiSettings className="w-5 h-5" />,
      label: "Settings",
      Link: "/admin/settings",
    },
  ],
};

const Sidebar = ({ activeLabel, setActiveLabel, onClose }) => {
  const role = useSelector(selectUserRole);
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();
  const menuItems = menuConfig[role];
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (err) {
      // ignore backend error
    } finally {
      dispatch(logout());
      dispatch(userApi.util.resetApiState());
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="flex flex-col px-2 h-full">
      <div className="flex justify-center items-center py-4">
        <img src={brandlogo} alt="logo" className="w-20 h-20 object-contain" />
      </div>

      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-150px)]">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.Link}
            className={`flex items-center gap-3 px-5 py-2 cursor-pointer transition-all rounded-lg ${
              activeLabel === item.label
                ? "bg-[#007CCD] text-white font-semibold"
                : "text-black hover:bg-gray-100"
            }`}
            onClick={() => {
              setActiveLabel(item.label);
              if (onClose) onClose();
            }}
          >
            {item.icon}
            <p>{item.label}</p>
          </Link>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="bg-primarycolor text-white mb-4 w-full py-3 flex justify-center items-center cursor-pointer rounded-lg mt-4"
      >
        <FiLogOut className="text-xl" />
        <p className="ml-2">Log out</p>
      </button>
    </div>
  );
};

export default Sidebar;
