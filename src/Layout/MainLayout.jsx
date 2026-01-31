import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ConfigProvider, Drawer } from "antd";
import { FiArrowLeft, FiMenu, FiX } from "react-icons/fi";

import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { menuConfig } from "./Sidebar";
import SalesRepTopbar from "./SalesRepTopbar";
import { useSelector } from "react-redux";
import { selectUserRole } from "../redux/slice/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import FAB from "../Components/Common/FAB";
import { Toaster } from "react-hot-toast";

const MainLayout = () => {
  const role = useSelector(selectUserRole);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const getDefaultLabel = (role) => {
    switch (role) {
      case "Admin":
        return "Dashboard";
      case "Production Manager":
        return "Home";
      case "Sales Rep":
        return "Home";
      default:
        return "Dashboard";
    }
  };

  const [activeLabel, setActiveLabel] = useState(getDefaultLabel(role));

  const getActiveLabelFromPath = (role, pathname) => {
    const menuItems = menuConfig?.[role] || [];
    const normalizedPath = pathname.replace(/\/+$/, "");
    let bestMatch = null;

    menuItems.forEach((item) => {
      const link = item.Link.replace(/\/+$/, "");
      if (normalizedPath === link || normalizedPath.startsWith(`${link}/`)) {
        if (!bestMatch || link.length > bestMatch.link.length) {
          bestMatch = { label: item.label, link };
        }
      }
    });

    return bestMatch?.label || getDefaultLabel(role);
  };

  useEffect(() => {
    setActiveLabel(getActiveLabelFromPath(role, location.pathname));
  }, [role, location.pathname]);

  const toggleDrawer = () => setOpen((prev) => !prev);

  const getParentPath = (pathname) => {
    const normalized = pathname.replace(/\/+$/, "");
    const parts = normalized.split("/").filter(Boolean);

    if (parts.length <= 1) return "/";

    return `/${parts.slice(0, -1).join("/")}`;
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(getParentPath(location.pathname), { replace: true });
  };

  const sidebarLinks = (menuConfig?.[role] || []).map((item) => item.Link);
  const normalizedPathname = location.pathname.replace(/\/+$/, "");
  const shouldShowBackButton = !sidebarLinks.includes(normalizedPathname);

  return (
    <div className="min-h-screen flex bg-gray-50 relative">
      {/* SIDEBAR Desktop */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-72 bg-white shadow-md z-20">
        <Sidebar activeLabel={activeLabel} setActiveLabel={setActiveLabel} />
      </aside>

      {/* SIDEBAR Mobile Drawer */}
      <ConfigProvider
        theme={{ components: { Drawer: { colorBgElevated: "#ffffff" } } }}
      >
        <Drawer
          placement="left"
          width="80%"
          onClose={toggleDrawer}
          open={open}
          closeIcon={<FiX className="text-2xl" />}
        >
          <Sidebar
            activeLabel={activeLabel}
            setActiveLabel={setActiveLabel}
            onClose={toggleDrawer}
          />
        </Drawer>
      </ConfigProvider>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-72 w-full">
        {/* HEADER */}
        <header className="fixed top-0 left-0 lg:left-72 w-full lg:w-[calc(100%-18rem)] bg-white shadow-sm z-10 px-5 py-4 flex justify-between items-center">
          {/* Hamburger (mobile only) */}
          <button className="lg:hidden" onClick={toggleDrawer}>
            <FiMenu className="text-2xl" />
          </button>

          {/* Topbar */}
          <div className="flex-1">
            <Topbar label={activeLabel} />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 mt-20 p-4 relative">
          {shouldShowBackButton && (
            <div className="mb-4">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50"
                type="button"
              >
                <FiArrowLeft className="text-lg" />
                <span className="text-sm font-medium">Back</span>
              </button>
            </div>
          )}
          <Outlet />

          {/* Floating Action Button */}
          {role !== "Production Manager" && <FAB />}
          {/* <FAB/> */}
        </main>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default MainLayout;
