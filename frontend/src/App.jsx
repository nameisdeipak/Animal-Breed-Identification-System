import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { checkAuth } from "./Slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from 'react-hot-toast';
import { useEffect } from "react";

// Components & Pages
import Navbar from "./components/Navbar";
import LandingPage from "./Pages/LandingPage";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import RegisterAnimal from "./Pages/RegisterAnimal";
import Profile from "./Pages/Profile";
import AnimalDetails from "./Pages/AnimalDetails";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import AccountStatus from "./Pages/AccountStatus";

// ADMIN AREA (Add your admin components here)
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import PendingApprovals from "./Pages/admin/PendingApprovals";
import ManageWorkers from "./Pages/admin/ManageWorkers";
import RejectedAnimals from "./Pages/admin/RejectedAnimals";
import ManageAnimals from "./Pages/admin/ManageAnimals";
import UserControl from "./components/admin/UserControl";
import AdminProfile from "./Pages/admin/AdminProfile";
import ChangePassword from "./Pages/ChangePassword";

const App = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) return null;

  return (
    <div className="font-sans antialiased bg-[#fdfcf0] min-h-screen">
      {/* Toast provider */}
      <Toaster position="top-center" />

      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />
        
        {!isAuthenticated && (
          <Route element={<><Navbar /><Outlet /></>}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
          </Route>
        )}

        {isAuthenticated && user?.isActive === false && (
          <>
            <Route path="/account-status" element={<AccountStatus />} />
            <Route path="*" element={<Navigate to="/account-status" />} />
          </>
        )}


        {/* --- CLIENT (FLW) PROTECTED ROUTES --- */}
        {isAuthenticated && user?.role === "flw" && user?.isActive === true && (
          <Route element={<><Navbar /><Outlet /></>}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register-animal" element={<RegisterAnimal />} />
            <Route path="/animal-details/:id" element={<AnimalDetails />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/admin/*" element={<Navigate to="/dashboard" />} />


          </Route>
        )}



        {/* --- ADMIN PROTECTED ROUTES (Completely Different UI) --- */}
        {isAuthenticated && user?.role === "admin" && (
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="pending-approvals" element={<PendingApprovals />} />
            <Route path="rejected" element={<RejectedAnimals />} />
            <Route path="workers" element={<ManageWorkers />} />
            <Route path="animals" element={<ManageAnimals />} />
            <Route path="animal-details/:id" element={<AnimalDetails />} />
            <Route path="workers/:id" element={<UserControl />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="security-update" element={<ChangePassword />} />
          </Route>
        )}

        {/* Universal Redirects based on Auth status */}


        {isAuthenticated ? (
          user?.isActive === false ? (
            <Route path="*" element={<Navigate to="/account-status" />} />
          ) : (
            <Route path="*" element={<Navigate to={user?.role === "admin" ? "/admin" : "/dashboard"} />} />
          )
        ) : (
          <Route path="*" element={<Navigate to="/" />} />)
        }

      </Routes>
    </div>
  );
};

export default App;







