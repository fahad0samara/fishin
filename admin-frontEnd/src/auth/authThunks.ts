import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {clearUserData} from "./authSlice";
import {REGISTER_URL, LOGIN_URL, LOGOUT_URL, FETCH_USER_URL} from "../urls";

export interface UserData {
  _id?: string;
  firstName: string;

  email: string;
  password: string;
  role: string;
  
}
interface LoginResponse {
  user: unknown;
  isAdmin: boolean;
  token: string;
}

interface User {
  token: string | null;
  user: unknown;
  isAdmin: boolean;
  id: number;
  email: string;
  name: string;
}

// Register user
export const register = createAsyncThunk<
  User,
  FormData, // Change the payload type to FormData
  {rejectValue: {message: string; statusCode: number}}
>("auth/register", async (formData, {rejectWithValue}) => {
  try {
    const response = await axios.post<User>(REGISTER_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Make sure to set the correct content type
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response &&
          error.response.data &&
          error.response?.data?.message) ||
        "Failed to fetch user data";
      return rejectWithValue(message);
    }
    throw error;
  }
});

// Login user
export const login = createAsyncThunk<
  LoginResponse,
  UserData,
  {rejectValue: string}
>("auth/login", async (credentials, {rejectWithValue}) => {
  try {
    const response = await axios.post<LoginResponse>(
      LOGIN_URL,

      credentials
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response &&
          error.response.data &&
          error.response?.data?.message) ||
        "Failed to fetch user data";
      return rejectWithValue(message);
    }
    throw error;
  }
});

// Logout user
export const logout = createAsyncThunk<void, void, {rejectValue: string}>(
  "auth/logout",
  async (_, {dispatch, rejectWithValue}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      await axios.post(LOGOUT_URL, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(clearUserData());

      return;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to fetch user data";
        return rejectWithValue(message);
      }
      throw error;
    }
  }
);

export const fetchUserData = createAsyncThunk<
  User,
  void,
  {rejectValue: {message: string; error: string}}
>("auth/fetchUserData", async (_, thunkAPI) => {
  const token = localStorage.getItem("token");


  if (!token) {
    console.log("Token not available"); // Debug: Check if this block is executed
    thunkAPI.dispatch(logout()); // Logout the user if token is not available
    return thunkAPI.rejectWithValue({
      message: "User is not authenticated",
      error: "",
    });
  }

  try {
    const response = await axios.get<User>(
      FETCH_USER_URL,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to fetch user data";
      const err = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue({message, error: err});
    }
    throw error;
  }
});


//update the user profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, {rejectWithValue}) => {
    try {
      const response = await axios.put("/api/update-profile", userData); // Adjust the API endpoint
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          "Failed to update profile";
        return rejectWithValue(message);
      }
      throw error;
    }
  }
);
