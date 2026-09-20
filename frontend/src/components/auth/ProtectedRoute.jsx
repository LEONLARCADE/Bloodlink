import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants";

/**
 * Wrap a route element to require authentication (and optionally a role
 * and/or a completed profile).
 *
 *   <Route path="dashboard" element={
 *     <ProtectedRoute roles={["DONOR"]} requireProfile>
 *       <DonorLayout />
 *     </ProtectedRoute>
 *   } />
 *
 * requireProfile redirects to /complete-profile instead of the dashboard
 * when the user is authenticated but hasn't finished onboarding yet.
 * Leave it off for the completion page itself, or you'll get a loop.
 */
export default function ProtectedRoute({ children, roles, requireProfile = false }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null; // AuthContext resolves fast; avoids a flash-redirect to /login
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  if (requireProfile && !user.hasProfile) {
    return <Navigate to={ROUTES.COMPLETE_PROFILE} replace />;
  }

  return children;
}