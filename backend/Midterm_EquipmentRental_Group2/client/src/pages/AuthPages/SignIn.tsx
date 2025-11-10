import { useEffect } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useAuth } from "../../context/AuthContext";

export default function SignIn() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Redirect if already authenticated
    if (!isLoading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading or redirect if authenticated
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <PageMeta
        title="Sign In - Equipment Rental System"
        description="Sign in to Equipment Rental System"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
