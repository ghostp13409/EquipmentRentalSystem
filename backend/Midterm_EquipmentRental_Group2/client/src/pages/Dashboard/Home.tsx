import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  const { role } = useAuth();

  return (
    <>
      <PageMeta
        title="Equipment Rental System Dashboard"
        description="Dashboard for Equipment Rental Management System"
      />
      {role === 'Admin' ? <AdminDashboard /> : <UserDashboard />}
    </>
  );
}
