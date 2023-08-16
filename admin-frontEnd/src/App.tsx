import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import {useNavigate} from "react-router-dom";

import {ToastContainer} from "react-toastify";

import DarkModeToggle from "./hook/DarkModeToggle";
import {useDarkMode} from "./hook/useDarkMode";

import {RootState} from "./Redux/store";
import {AnyAction, ThunkDispatch} from "@reduxjs/toolkit";
import {fetchUserData, logout} from "./auth/authThunks";
import Router from "./router/Router";


const App = () => {
  const isDarkMode = useDarkMode();
    const navigate = useNavigate();
  const dispatch: ThunkDispatch<RootState, null, AnyAction> = useDispatch();
  const {isAuthenticated, token} = useSelector(
    (state: RootState) => state.auth
  );

useEffect(() => {
  const initializeApp = async () => {
    if (isAuthenticated || token) {
      // If the user is already authenticated or a token exists in Redux state, fetch user data
      dispatch(fetchUserData());
    } else {
      // If the user is not authenticated and no token exists in Redux state, logout
      dispatch(logout());
    }
  };

  initializeApp();
}, [dispatch, isAuthenticated, token]);




  return (
    <div
      className={` ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <DarkModeToggle />
      <ToastContainer />
      <Router />
    </div>
  );
};

export default App;
