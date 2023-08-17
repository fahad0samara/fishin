import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import NotFound from '../Home/NotFound';
import Login from '../authr/Login';
import Profile from '../Home/Profile';
import RegisterForm from '../authr/RegisterForm';
import Hero from '../Home/Hero';
import { RootState } from '../Redux/store';

import ProfileAdmin from '../admin/ProfileAdmin';
import Layout from './NavSide/Layout';
import Category from '../page/Category';
import Product from '../page/product/Product';
import UserList from '../admin/UserList';
import AdminRegistration from '../admin/AdminRegistration';

const Router = (): JSX.Element => {
   const {isAuthenticated,  isAdmin} = useSelector(
    (state: RootState) => state.auth
  );

  
  return (
    <Layout>
      <Routes>
        <Route path="/admin" element={<AdminRegistration />} />
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

         {/* Protected Routes for Authenticated admin */}
        {isAuthenticated && isAdmin && (
          <>
            <Route path="/UserList" element={<UserList />} />
            <Route path="/ProfileAdmin" element={<ProfileAdmin />} />
              <Route path="/Product" element={<Product />} />
                <Route path="/Category" element={<Category />} />
            
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
    </Layout>
  );
};

export default Router;
