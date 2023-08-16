import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { clearUserData } from "./authSlice";
import {
  REGISTER_URL,
  LOGIN_URL,
  LOGOUT_URL,
  FETCH_USER_URL,
  UPDATE_USER_URL,
  DELETE_USER_URL,
} from "../urls";

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
  role: string;
  
  
}

interface User {
  token: string | null;
  user: unknown;
  isAdmin: boolean;
  id: number;
  email: string;
  name: string;
  role: string;
  
}



interface UpdateProfileArgs {
  userId: number;
  user: {
    name: string;
    email: string;
    deleteProfileImage: boolean;
    newProfileImage: File | null;
  };
}

// Register user
export const register = createAsyncThunk<
  User,
  FormData, // Change the payload type to FormData
  { rejectValue: { message: string; statusCode: number } }
>("auth/register", async (formData, { rejectWithValue }) => {
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
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post<LoginResponse>(
      LOGIN_URL,

      credentials
    );
    console.log(response.data);

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
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
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
  { rejectValue: { message: string; error: string } }
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
    const response = await axios.get<User>(FETCH_USER_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to fetch user data";
      const err = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue({ message, error: err });
    }
    throw error;
  }
});

// // export const updateProfile = createAsyncThunk(
//   "auth/updateProfile",
//   async (args: UpdateProfileArgs, thunkAPI) => {
//     const {userId, user} = args;
//     const token = localStorage.getItem("token");
//     if (!token) {
//       thunkAPI.dispatch(logout());
//       return thunkAPI.rejectWithValue("User is not authenticated");
//     }
//     try {
//       const response = await axios.put<User>(
//         `http://localhost:3000/auth/update/
//         ${userId}
//         `,

//         user,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         const message =
//           error.response?.data?.message || "Failed to update profile";
//         return thunkAPI.rejectWithValue(message);
//       }
//       throw error;
//     }
//   }

// );

export const updateProfile = createAsyncThunk<
  User,
  UpdateProfileArgs,
  { rejectValue: string }
>("auth/updateProfile", async ({ userId, user }, thunkAPI) => {

  const token = localStorage.getItem("token");

  if (!token) {
    console.log("Token not available");
    thunkAPI.dispatch(logout());
    return thunkAPI.rejectWithValue("User is not authenticated");
  }

  const formData = new FormData();
  formData.append("name", user.name);
  formData.append("email", user.email);
  formData.append("deleteProfileImage", user.deleteProfileImage.toString());

  if (user.newProfileImage) {
    formData.append("profileImage", user.newProfileImage);
  }

  try {
    const response = await axios.put<User>(
      `${UPDATE_USER_URL}/${userId}`, // Use _id for MongoDB update
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;

    // Convert _id to id in the response before updating Redux state
  } catch (error) {
    console.log(error);

    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to update user profile";
      return thunkAPI.rejectWithValue(message);
    }
    throw error;
  }
});

//delet the user
export const deleteUser = createAsyncThunk<
  void, // Return type should be void
  { userId: number },
  { rejectValue: string }
>("auth/deleteUser", async ({ userId }, thunkAPI) => {
  // Remove 'user' from the destructuring
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("Token not available");
    thunkAPI.dispatch(logout());
    return thunkAPI.rejectWithValue("User is not authenticated");
  }

  try {
    await axios.delete(`${DELETE_USER_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    thunkAPI.dispatch(clearUserData());
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to delete user";
      return thunkAPI.rejectWithValue(message);
    }
    throw error;
  }
});
