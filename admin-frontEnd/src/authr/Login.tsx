import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../Redux/store';
import { login } from '../auth/authThunks';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const error = useSelector((state: RootState) => state.auth.error);
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();

  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      await dispatch(login({ email, password }));
      console.log('User logged in successfully.');
      alert('User logged in successfully.');
      navigate('/Profile');
    } catch (error) {
      console.error(error);
      alert('Error logging in');
    }
  };

  //eror
  if (error) {
    return <p>{error}</p>;
  }




  return (
    <div className="flex items-center justify-center h-screen">
      <div className={'bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3'}>
        <h2 className="text-xl font-semibold mb-4">User Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
