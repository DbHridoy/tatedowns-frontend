import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../redux/api/authApi";
import { logout, selectUserRole } from "../redux/slice/authSlice";
import brandlogo from "../assets/Logo.svg";
import { FiLogOut } from "react-icons/fi";
import { userApi } from "../redux/api/userApi";
import { menuConfig } from "./menuConfig.jsx";

const Sidebar = ({ activeLabel, setActiveLabel, onClose }) => {
  const role = useSelector(selectUserRole);
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();
  const menuItems = menuConfig[role];
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
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
              item.separated ? "mt-4 pt-4 border-t border-gray-200" : ""
            } ${
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
