import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: "user" | "vendor";
}

export const ProtectedRoute = ({ children, requiredUserType }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userType = localStorage.getItem("userType");

    if (!isAuthenticated) {
      // Not authenticated, redirect to sign-in
      navigate("/user/signin");
      return;
    }

    // If specific user type required, check it
    if (requiredUserType && userType !== requiredUserType) {
      // Wrong user type, redirect to appropriate sign-in
      if (requiredUserType === "vendor") {
        navigate("/vendor/signin");
      } else {
        navigate("/user/signin");
      }
    }
  }, [navigate, requiredUserType]);

  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userType = localStorage.getItem("userType");

  // Show children only if authenticated and user type matches (if required)
  if (!isAuthenticated) {
    return null;
  }

  if (requiredUserType && userType !== requiredUserType) {
    return null;
  }

  return <>{children}</>;
};


