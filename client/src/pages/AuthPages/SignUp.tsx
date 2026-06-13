import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Sign Up - Equipment Rental System"
        description="Create account for Equipment Rental System"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
