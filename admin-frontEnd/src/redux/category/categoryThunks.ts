import {createAsyncThunk} from "@reduxjs/toolkit";
import axios, {AxiosError} from "axios";

interface Category {
  _id: number;
  name: string;
  description: string;
  // Add other properties as needed
}

export interface ErrorResponse {
    message: string;

}



export const createCategory = createAsyncThunk<
  Category,
  {name: string; description: string},
  {rejectValue: ErrorResponse}
>("categories/createCategory", async (categoryData, thunkAPI) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/categories/add",
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


export const updateCategory = createAsyncThunk<
  Category,
  {categoryId: number; categoryData: Omit<Category, "_id">},
  {rejectValue: ErrorResponse}
>("categories/updateCategory", async ({categoryId, categoryData}, thunkAPI) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/categories/update/${categoryId}`,
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
    await axios.delete(`http://localhost:3000/categories/delete/${categoryId}`);
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
      const response = await axios.get("http://localhost:3000/categories/get");
        return response.data;

      
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return thunkAPI.rejectWithValue(
      axiosError.response?.data || {message: "An error occurred"}
    );
  }
});
