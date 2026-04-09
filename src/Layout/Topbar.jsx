import { useGetMeQuery } from "../redux/api/userApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserRole } from "../redux/slice/authSlice";

const Topbar = ({ label, showLabel = true }) => {
  const navigate = useNavigate();
  const role = useSelector(selectUserRole);
  const { data: profileData } = useGetMeQuery();
  const profile = profileData?.data;
  const profilePath =
    role === "Admin"
      ? "/admin/settings"
      : role === "Production Manager"
        ? "/production-manager/settings"
        : role === "Sales Rep"
          ? "/sales-rep/settings"
          : "/";
  //console.log("Profile data:", profile);
  return (
    <div className="flex items-center justify-between w-full">
      {/* Page Title */}
      {showLabel ? (
        <div className="min-w-0">
          <h1 className="text-base sm:text-xl font-semibold truncate">
            {label}
          </h1>
        </div>
      ) : (
        <div />
      )}

      {/* Right section: avatar */}
      <div className="relative flex items-center gap-3 sm:gap-4">
        {/* User avatar */}
        <button
          type="button"
          onClick={() => navigate(profilePath)}
          className="flex items-center gap-2 cursor-pointer text-left"
        >
          <img
            src={profile?.profileImage || ""}
            alt={profile?.fullName || "User"}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
          />
          <div>
            <p className="hidden md:block font-medium">
              {profile?.fullName || "Username"}
            </p>
            <p className="hidden md:block text-sm text-gray-500">
              {profile?.role || "User Role"}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Topbar;
