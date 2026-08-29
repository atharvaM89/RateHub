import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Public Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// Shared Pages
import ChangePassword from './pages/ChangePassword';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import OwnerLayout from './layouts/OwnerLayout';
import UserLayout from './layouts/UserLayout';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UsersList from './pages/admin/UsersList';
import StoresList from './pages/admin/StoresList';
import AddUser from './pages/admin/AddUser';
import AddStore from './pages/admin/AddStore';
import UserDetails from './pages/admin/UserDetails';

// User Pages
import StoreListing from './pages/user/StoreListing';

// Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerRatingsList from './pages/owner/RatingsList';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Fallback Root Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Shared Authenticated Routes */}
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['ADMIN']}>
                  <AdminLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UsersList />} />
            <Route path="users/new" element={<AddUser />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="stores" element={<StoresList />} />
            <Route path="stores/new" element={<AddStore />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Normal User Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['USER']}>
                  <UserLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route path="stores" element={<StoreListing />} />
          </Route>

          {/* Store Owner Routes */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['STORE_OWNER']}>
                  <OwnerLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="ratings" element={<OwnerRatingsList />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
