import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { lazy, Suspense } from 'react';
import NotFound from '../Home/NotFound';
import Login from '../authr/Login';
import Profile from '../Home/Profile';
import RegisterForm from '../authr/RegisterForm';
import Hero from '../Home/Hero';
import { RootState } from '../Redux/store';

const AppRouter = (): JSX.Element => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
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
