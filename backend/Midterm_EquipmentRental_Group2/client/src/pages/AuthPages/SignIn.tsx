import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
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
