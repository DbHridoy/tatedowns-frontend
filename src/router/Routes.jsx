import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import RoleGuard from "./RoleGuard";
import MainLayout from "../Layout/MainLayout";

// Auth Pages
import Login from "../Pages/Auth/Login";
import ForgetPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOTP";
import SetNewPassword from "../Pages/Auth/SetNewPassword";
import Successful from "../Pages/Auth/Successful";

// Admin Pages
import Dashboard from "../Pages/Admin/Dashboard/Dashboard";
import Approvals from "../Pages/Admin/Approvals/Approvals";
import MileageDetails from "../Pages/Admin/MileageLog/MileageDetails";
import Reports from "../Pages/Admin/Reports/Reports";
import RepDetails from "../Pages/Admin/Reports/RepDetails";
import UserManagement from "../Pages/Admin/UserManagement/UserManagement";
import Parameters from "../Pages/Admin/Params/Parameters";

// Sales Rep Pages
import SalesRepHome from "../Pages/Sales-rep/Home/SalesRepHome";
import Clients from "../Pages/Sales-rep/Clients/Clients";
import ClientDetails from "../Pages/Sales-rep/Clients/ClientDetails";
import AddCallLog from "../Pages/Sales-rep/Clients/AddCallLog";
import Quotes from "../Pages/Sales-rep/Quotes/Quote";
import AddNewQuote from "../Pages/Sales-rep/Quotes/AddNewQuote";
import QuoteDetails from "../Pages/Sales-rep/Quotes/QuoteDetails";
import Jobs from "../Pages/Sales-rep/Jobs/Jobs";
import JobDetailsPage from "../Pages/Sales-rep/Jobs/JobDetailsPage";
import AddNewJob from "../Pages/Sales-rep/Jobs/AddNewJob";
import DesignConsultation from "../Pages/Sales-rep/Jobs/DesignConsultation";
import UserExpenses from "../Pages/Sales-rep/ExpensesMileage/Expenses";
import SalesReports from "../Pages/Sales-rep/Reports/SalesRepReports";

// Production Manager Pages
import ProductionHome from "../Pages/Production-Manager/ProductionHome/ProductionHome";
import ProductionSettings from "../Pages/Common/ProductionSettings";
import ProductionCalendarPage from "../Pages/Production/ProductionCalendarPage";
import CrewManagementPage from "../Pages/Production/CrewManagementPage";
import PainterManagementPage from "../Pages/Production/PainterManagementPage";
import PainterDashboardPage from "../Pages/Painter/PainterDashboardPage";
import PainterCrewPage from "../Pages/Painter/PainterCrewPage";
import PainterSchedulePage from "../Pages/Painter/PainterSchedulePage";
import JobScheduling from "../Pages/Production-Manager/JobScheduling/JobScheduling"

// Common
import GlobalNoRoute from "../Pages/Common/GlobalNoRoute";
import Settings from "../Pages/Common/ProductionSettings";
import AddClient from "../Pages/Common/AddClient";
import ProductionManagerReports from "../Pages/Production-Manager/Reports/ProductionManagerReports";
import MyJobs from "../Pages/Production-Manager/MyJobs/PmJobs";
import PmScheduledJobs from "../Pages/Production-Manager/MyJobs/PmScheduledJobs";
import AdminClientDetails from "../Pages/Admin/Clients/AdminClientDetails";
import AdminQuote from "../Pages/Admin/Quotes/AdminQuote";
import AdminQuoteDetails from "../Pages/Admin/Quotes/AdminQuoteDetails";
import AdminJobs from "../Pages/Admin/Jobs/AdminJobs";
import AdminScheduledJobs from "../Pages/Admin/Jobs/AdminScheduledJobs";
import AdminJobDetailsPage from "../Pages/Admin/Jobs/AdminJobDetailsPage";
import ViewUser from "../Pages/Admin/UserManagement/ViewUser";
import PmJobDetailsPage from "../Pages/Production-Manager/MyJobs/PmJobDetailsPage";
import AdminClients from "../Pages/Admin/Clients/AdminClients";

export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <PublicRoute />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgetPassword /> },
      { path: "verify-otp", element: <VerifyOtp /> },
      { path: "set-password", element: <SetNewPassword /> },
      { path: "successful", element: <Successful /> }
    ]
  },

  // Sales Rep Routes
  {
    path: "/sales-rep",
    element: <RoleGuard allowedRole="Sales Rep" />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Navigate to="home" replace /> },
          { path: "home", element: <SalesRepHome /> },
          {
            path: "leads",
            children: [
              { index: true, element: <Clients /> },
              { path: ":clientId", element: <ClientDetails /> },
            ],
          },
          { path: "add-call-log", element: <AddCallLog /> },
          { path: "leads/add-lead", element: <AddClient /> },
          { path: "quotes", element: <Quotes /> },
          { path: "quotes/add-quote", element: <AddNewQuote /> },
          { path: "quotes/:quoteId", element: <QuoteDetails /> },
          { path: "jobs", element: <Jobs /> },
          { path: "jobs/add-job", element: <AddNewJob /> },
          { path: "jobs/:jobId", element: <JobDetailsPage /> },
          { path: "jobs/:jobId/design-consultation", element: <DesignConsultation /> },
          { path: "reports", element: <SalesReports /> },
          { path: "mileage-log", element: <UserExpenses /> },
          { path: "settings", element: <Settings /> },
          { path: "*", element: <GlobalNoRoute /> },
        ],
      },
    ],
  },

  // Shared production routes
  {
    path: "/production",
    element: <RoleGuard allowedRole={["Admin", "Production Manager"]} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Navigate to="calendar" replace /> },
          { path: "calendar", element: <ProductionCalendarPage /> },
          { path: "crews", element: <CrewManagementPage /> },
          { path: "painters", element: <PainterManagementPage /> },
          { path: "*", element: <GlobalNoRoute /> },
        ],
      },
    ],
  },

  // Production Manager Routes
  {
    path: "/production-manager",
    element: <RoleGuard allowedRole="Production Manager" />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Navigate to="home" replace /> },
          { path: "home", element: <ProductionHome /> }, // matches menuConfig
          { path: "jobs", element: <Navigate to="/production/calendar" replace /> },
          { path: "jobss", element: <JobScheduling /> },
          { path: "jobs/:jobId", element: <PmJobDetailsPage /> },
          { path: "scheduled-jobs", element: <PmScheduledJobs /> },
          { path: "my-jobs", element: <MyJobs /> },
          {
            path: "my-jobs/:jobId",
            element: <PmJobDetailsPage />,
          },
          { path: "reports", element: <ProductionManagerReports /> },
          { path: "settings", element: <ProductionSettings /> }, // matches menuConfig
          { path: "*", element: <GlobalNoRoute /> },
        ],
      },
    ],
  },

  // Painter Routes
  {
    path: "/painter",
    element: <RoleGuard allowedRole="Painter" />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <PainterDashboardPage /> },
          { path: "my-crew", element: <PainterCrewPage /> },
          { path: "schedule", element: <PainterSchedulePage /> },
          { path: "settings", element: <ProductionSettings /> },
          { path: "*", element: <GlobalNoRoute /> },
        ],
      },
    ],
  },

  // Admin Routes
  {
    path: "/admin",
    element: <RoleGuard allowedRole="Admin" />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "leads", element: <AdminClients /> },
          { path: "leads/:clientId", element: <AdminClientDetails /> },
          { path: "leads/add-lead", element: <AddClient /> },
          { path: "leads/add-leads", element: <Navigate to="/admin/leads/add-lead" replace /> },
          { path: "quotes", element: <AdminQuote /> },
          { path: "quotes/:quoteId", element: <AdminQuoteDetails /> },
          { path: "jobs", element: <AdminJobs /> },
          { path: "jobs/:jobId", element: <AdminJobDetailsPage /> },
          { path: "scheduled-jobs", element: <AdminScheduledJobs /> },
          { path: "approvals-center", element: <Approvals /> },
          { path: "mileage/:mileageId", element: <MileageDetails /> },
          { path: "reports", element: <Reports /> },
          { path: "reports-details/:id", element: <RepDetails /> },
          { path: "user-management", element: <UserManagement /> },
          { path: "user-management/:userId", element: <ViewUser /> },
          { path: "parameters", element: <Parameters /> }, // I assume this is Parameters page
          { path: "settings", element: <Settings /> },
          { path: "*", element: <GlobalNoRoute /> },
        ],
      },
    ],
  },

  // Fallback
  { path: "*", element: <GlobalNoRoute /> },
]);

