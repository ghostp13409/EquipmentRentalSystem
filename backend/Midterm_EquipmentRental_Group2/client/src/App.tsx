import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import OAuthCallback from "./pages/AuthPages/OAuthCallback";
import NotFound from "./pages/OtherPage/NotFound";
import TestConnection from "./components/TestConnection";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import EquipmentList from "./pages/Equipment/EquipmentList";
import EquipmentDetails from "./pages/Equipment/EquipmentDetails";
import EquipmentForm from "./pages/Equipment/EquipmentForm";
import RentalIssueForm from "./pages/Rentals/RentalIssueForm";
import CustomerList from "./pages/Customers/CustomerList";
import CustomerForm from "./pages/Customers/CustomerForm";
import CustomerDetails from "./pages/Customers/CustomerDetails";
import RentalList from "./pages/Rentals/RentalList";
import RentalDetails from "./pages/Rentals/RentalDetails";
import RentalReturnForm from "./pages/Rentals/RentalReturnForm";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/test-connection" element={<TestConnection />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index path="/" element={<Home />} />

            {/* Equipment */}
            <Route path="/equipment" element={<EquipmentList />} />
            <Route path="/equipment/create" element={<EquipmentForm />} />
            <Route path="/equipment/:id" element={<EquipmentDetails />} />
            <Route path="/equipment/:id/edit" element={<EquipmentForm />} />

            {/* Customers */}
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/create" element={<CustomerForm />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/customers/:id/edit" element={<CustomerForm />} />

            {/* Rentals */}
            <Route path="/rentals" element={<RentalList />} />
            <Route path="/rentals/:id" element={<RentalDetails />} />
            <Route path="/rentals/:id/return" element={<RentalReturnForm />} />
            <Route path="/rentals/issue/:equipmentId" element={<RentalIssueForm />} />

            {/* Profile */}
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
