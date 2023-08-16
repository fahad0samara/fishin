import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import NotFound from '../Home/NotFound';
import Login from '../authr/Login';
import Profile from '../Home/Profile';
import RegisterForm from '../authr/RegisterForm';
import Hero from '../Home/Hero';
import { RootState } from '../Redux/store';
import AdminRegistration from '../admin/AdminRegistration';
import ProfileAdmin from '../admin/ProfileAdmin';

const AppRouter = (): JSX.Element => {
  const {isAuthenticated,  isAdmin} = useSelector(
    (state: RootState) => state.auth
  );


  
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/Register" element={<RegisterForm />} />
        <Route path="/Login" element={<Login />} />
              

        {/* Protected Routes for Authenticated Users */}
        {isAuthenticated && (
          <>
            <Route path="/Profile" element={<Profile />} />
            {/* ... other authenticated user routes */}
          </>
        )}

        {/* Protected Routes for Admin Users */}
        {isAdmin && (
          <>
        
             <Route path="/ProfileAdmin" element={<ProfileAdmin />} />
            {/* ... other admin routes */}
          </>
        )}
      
    <Route path="/Admin" element={<AdminRegistration />} />

        {/* Default and Not Found Routes */}
        <Route path="/404" element={<NotFound />} />

        {/* Redirect unauthenticated users */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <NotFound />
            ) : (
              <Navigate to="/Login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default AppRouter;
