import {createAsyncThunk} from "@reduxjs/toolkit";
import axios, {AxiosError} from "axios";

interface Category {
  id: number;
  name: string;
  description: string;
  // Add other properties as needed
}

interface ErrorResponse {
  message: string; // Adjust this according to the structure of your error response
}

export const createCategory = createAsyncThunk<
  Category,
  Category,
  {rejectValue: ErrorResponse}
>("categories/createCategory", async (categoryData, thunkAPI) => {
  try {
    const response = await axios.post("/api/categories", categoryData);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return thunkAPI.rejectWithValue(
      axiosError.response?.data || {message: "An error occurred"}
    );
  }
});

export const updateCategory = createAsyncThunk<
  Category,
  {categoryId: number; categoryData: Category},
  {rejectValue: ErrorResponse}
>("categories/updateCategory", async ({categoryId, categoryData}, thunkAPI) => {
  try {
    const response = await axios.put(
      `/api/categories/${categoryId}`,
      categoryData
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return thunkAPI.rejectWithValue(
      axiosError.response?.data || {message: "An error occurred"}
    );
  }
});

export const deleteCategory = createAsyncThunk<
  number,
  number,
  {rejectValue: ErrorResponse}
>("categories/deleteCategory", async (categoryId, thunkAPI) => {
  try {
    await axios.delete(`/api/categories/${categoryId}`);
    return categoryId;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return thunkAPI.rejectWithValue(
      axiosError.response?.data || {message: "An error occurred"}
    );
  }
});

export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  {rejectValue: ErrorResponse}
>("categories/fetchCategories", async (_, thunkAPI) => {
  try {
    const response = await axios.get("/api/categories");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return thunkAPI.rejectWithValue(
      axiosError.response?.data || {message: "An error occurred"}
    );
  }
});
