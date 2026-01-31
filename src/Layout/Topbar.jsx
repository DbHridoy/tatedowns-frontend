import { useState } from "react";
import { FiBell } from "react-icons/fi";
import NotificationsDropdown from "../Components/Common/NotificationsDropdown";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from "../redux/api/common";
import { useGetMeQuery } from "../redux/api/userApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserRole } from "../redux/slice/authSlice";

const Topbar = ({ label }) => {
  const navigate = useNavigate();
  const role = useSelector(selectUserRole);
  const { data: profileData } = useGetMeQuery();
  const profile = profileData?.data;
  const { data: notificationsData } = useGetNotificationsQuery();
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const notifications = notificationsData?.data ?? [];
  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const [isOpen, setIsOpen] = useState(false);
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
      <div className="min-w-0">
        <h1 className="text-base sm:text-xl font-semibold truncate">
          {label}
        </h1>
      </div>

      {/* Right section: notifications + avatar */}
      <div className="relative flex items-center gap-3 sm:gap-4">
        {/* Notification */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <FiBell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </button>
        {isOpen && (
          <NotificationsDropdown
            notifications={notifications}
            onItemClick={async (item) => {
              if (item.isRead) return;
              await markNotificationRead(item._id).unwrap();
            }}
            onClose={() => setIsOpen(false)}
          />
        )}

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
