import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import DonorLayout from "../layouts/DonorLayout";
import RecipientLayout from "../layouts/RecipientLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/public/Home";
import About from "../pages/public/About";
import HowItWorks from "../pages/public/HowItWorks";
import Contact from "../pages/public/Contact";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import CompleteProfile from "../pages/onboarding/CompleteProfile";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import DonorDashboard from "../pages/donor/Dashboard";
import DonorProfile from "../pages/donor/Profile";
import DonorRequests from "../pages/donor/Requests";
import DonorHistory from "../pages/donor/History";

import RecipientDashboard from "../pages/recipient/Dashboard";
import RecipientSearch from "../pages/recipient/Search";
import RecipientRequests from "../pages/recipient/Requests";
import RecipientProfile from "../pages/recipient/Profile";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminDonors from "../pages/admin/Donors";
import AdminRecipients from "../pages/admin/Recipients";
import AdminRequests from "../pages/admin/Requests";
import AdminReports from "../pages/admin/Reports";

import NotFound from "../pages/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Authenticated, but deliberately outside the profile guard below —
          this IS the page that resolves an incomplete profile. */}
      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/donor"
        element={
          <ProtectedRoute roles={["DONOR"]} requireProfile>
            <DonorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/donor/dashboard" replace />} />
        <Route path="dashboard" element={<DonorDashboard />} />
        <Route path="profile" element={<DonorProfile />} />
        <Route path="requests" element={<DonorRequests />} />
        <Route path="history" element={<DonorHistory />} />
      </Route>

      <Route
        path="/recipient"
        element={
          <ProtectedRoute roles={["RECIPIENT"]} requireProfile>
            <RecipientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/recipient/dashboard" replace />} />
        <Route path="dashboard" element={<RecipientDashboard />} />
        <Route path="search" element={<RecipientSearch />} />
        <Route path="requests" element={<RecipientRequests />} />
        <Route path="profile" element={<RecipientProfile />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="donors" element={<AdminDonors />} />
        <Route path="recipients" element={<AdminRecipients />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;