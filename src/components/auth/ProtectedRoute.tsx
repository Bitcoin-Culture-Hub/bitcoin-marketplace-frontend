import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Wrap any route that requires authentication.
 * Preserves the intended destination so after login the user is returned there.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { customer, loading } = useAuth();
  const location = useLocation();

  // Still checking session — render nothing to avoid flash
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
