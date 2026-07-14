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
import { APP_ROLES } from "../constants/roles";

export const menuConfig = {
  [APP_ROLES.SALES_REP]: [
    { icon: <FiGrid className="w-5 h-5" />, label: "Home", Link: "/sales-rep/home" },
    { icon: <FiUsers className="w-5 h-5" />, label: "Leads", Link: "/sales-rep/leads" },
    { icon: <FiFileText className="w-5 h-5" />, label: "Quotes", Link: "/sales-rep/quotes" },
    { icon: <FiBriefcase className="w-5 h-5" />, label: "Jobs", Link: "/sales-rep/jobs" },
    { icon: <FiBarChart2 className="w-5 h-5" />, label: "Reports", Link: "/sales-rep/reports" },
    { icon: <FiTruck className="w-5 h-5" />, label: "Mileage Log", Link: "/sales-rep/mileage-log" },
    { icon: <FiSettings className="w-5 h-5" />, label: "Settings", Link: "/sales-rep/settings" },
  ],
  [APP_ROLES.PRODUCTION_MANAGER]: [
    { icon: <FiHome className="w-5 h-5" />, label: "Home", Link: "/production-manager/home" },
    { icon: <FiCalendar className="w-5 h-5" />, label: "Production Calendar", Link: "/production/calendar" },
    { icon: <FiUsers className="w-5 h-5" />, label: "Crews", Link: "/production/crews" },
    { icon: <FiUserCheck className="w-5 h-5" />, label: "Painters", Link: "/production/painters" },
    {
      icon: <FiCalendar className="w-5 h-5" />,
      label: "Jobs",
      Link: "/production-manager/jobs",
    },
    { icon: <FiSettings className="w-5 h-5" />, label: "Settings", Link: "/production-manager/settings" },
  ],
  [APP_ROLES.ADMIN]: [
    { icon: <FiGrid className="w-5 h-5" />, label: "Dashboard", Link: "/admin/dashboard" },
    { icon: <FiUsers className="w-5 h-5" />, label: "Leads", Link: "/admin/leads" },
    { icon: <FiFileText className="w-5 h-5" />, label: "Quotes", Link: "/admin/quotes" },
    { icon: <FiBriefcase className="w-5 h-5" />, label: "Jobs", Link: "/admin/jobs" },
    { icon: <FiCalendar className="w-5 h-5" />, label: "Production Calendar", Link: "/production/calendar" },
    { icon: <FiUsers className="w-5 h-5" />, label: "Crews", Link: "/production/crews" },
    { icon: <FiCheckSquare className="w-5 h-5" />, label: "Approvals Center", Link: "/admin/approvals-center" },
    { icon: <FiUserCheck className="w-5 h-5" />, label: "User Management", Link: "/admin/user-management" },
    { icon: <FiSliders className="w-5 h-5" />, label: "Parameters", Link: "/admin/parameters" },
    { icon: <FiSettings className="w-5 h-5" />, label: "Settings", Link: "/admin/settings" },
  ],
  [APP_ROLES.PAINTER]: [
    { icon: <FiHome className="w-5 h-5" />, label: "Dashboard", Link: "/painter/dashboard" },
    { icon: <FiUsers className="w-5 h-5" />, label: "My Crew", Link: "/painter/my-crew" },
    { icon: <FiCalendar className="w-5 h-5" />, label: "My Schedule", Link: "/painter/schedule" },
    { icon: <FiSettings className="w-5 h-5" />, label: "Settings", Link: "/painter/settings" },
  ],
};
