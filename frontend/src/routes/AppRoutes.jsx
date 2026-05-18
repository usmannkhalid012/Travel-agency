import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import SearchResults from '../pages/public/SearchResults';
import BusDetails from '../pages/public/BusDetails';
import ForgotPassword from '../pages/public/ForgotPassword';
import ResetPassword from '../pages/public/ResetPassword';
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import MyBookings from '../pages/customer/MyBookings';
import Profile from '../pages/customer/Profile';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageBuses from '../pages/admin/ManageBuses';
import AddBus from '../pages/admin/AddBus';
import EditBus from '../pages/admin/EditBus';
import ManageBookings from '../pages/admin/ManageBookings';
import ManageUsers from '../pages/admin/ManageUsers';

const PublicWrapper = ({ children }) => <MainLayout>{children}</MainLayout>;
const DashboardWrapper = ({ children }) => <DashboardLayout>{children}</DashboardLayout>;

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicWrapper><Home /></PublicWrapper>} />
      <Route path="/about" element={<PublicWrapper><About /></PublicWrapper>} />
      <Route path="/contact" element={<PublicWrapper><Contact /></PublicWrapper>} />
      <Route path="/login" element={<PublicWrapper><Login /></PublicWrapper>} />
      <Route path="/register" element={<PublicWrapper><Register /></PublicWrapper>} />
      <Route path="/search" element={<PublicWrapper><SearchResults /></PublicWrapper>} />
      <Route path="/buses/:id" element={<PublicWrapper><BusDetails /></PublicWrapper>} />
      <Route path="/forgot-password" element={<PublicWrapper><ForgotPassword /></PublicWrapper>} />
      <Route path="/reset-password/:token" element={<PublicWrapper><ResetPassword /></PublicWrapper>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardWrapper><CustomerDashboard /></DashboardWrapper></ProtectedRoute>} />
      <Route path="/dashboard/bookings" element={<ProtectedRoute><DashboardWrapper><MyBookings /></DashboardWrapper></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardWrapper><Profile /></DashboardWrapper></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><DashboardWrapper><AdminDashboard /></DashboardWrapper></ProtectedRoute>} />
      <Route path="/admin/buses" element={<ProtectedRoute roles={['admin']}><DashboardWrapper><ManageBuses /></DashboardWrapper></ProtectedRoute>} />
      <Route path="/admin/buses/add" element={<ProtectedRoute roles={['admin']}><DashboardWrapper><AddBus /></DashboardWrapper></ProtectedRoute>} />
      <Route path="/admin/buses/:id/edit" element={<ProtectedRoute roles={['admin']}><DashboardWrapper><EditBus /></DashboardWrapper></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute roles={['admin']}><DashboardWrapper><ManageBookings /></DashboardWrapper></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><DashboardWrapper><ManageUsers /></DashboardWrapper></ProtectedRoute>} />
    </Routes>
  );
}