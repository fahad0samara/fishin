import {createAsyncThunk} from "@reduxjs/toolkit";
import axios, {AxiosError} from "axios";

interface Product {
  _id:  null | undefined;

  name: string;
  price: number;
  category: string;
  description: string;
  images: File[];
  brand: string;
  selectedColors: string[];
  selectedSizes: string[];
}

export interface ErrorResponse {
  message: string;
}

export const createProduct = createAsyncThunk<
  Product,
  FormData, // Use the correct type for your form data
  {rejectValue: ErrorResponse}
>("products/createProduct", async (ProductData, thunkAPI) => {
  try {
    const formDataWithImages = ProductData.formDataWithImages; // Extract form data from the payload

    const response = await axios.post(
      "http://localhost:3000/products/add",
      formDataWithImages,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return thunkAPI.rejectWithValue(
      axiosError.response?.data || {message: "An error occurred"}
    );
  }
});


export const updateProduct = createAsyncThunk<
  Product,
  {ProductId: number; ProductData: Omit<Product, "_id">},
  {rejectValue: ErrorResponse}
>("products/updateProduct", async ({ProductId, ProductData}, thunkAPI) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/products/update/${ProductId}`,
      ProductData
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return thunkAPI.rejectWithValue(
      axiosError.response?.data || {message: "An error occurred"}
    );
  }
});

export const deleteProduct = createAsyncThunk<
  number,
  number,
  {rejectValue: ErrorResponse}
>("products/deleteProduct", async (ProductId, thunkAPI) => {
  try {
    await axios.delete(`http://localhost:3000/products/delete/${ProductId}`);
    return ProductId;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return thunkAPI.rejectWithValue(
      axiosError.response?.data || {message: "An error occurred"}
    );
  }
});

export const fetchProduct = createAsyncThunk<
  Product[],
  void,
  {rejectValue: ErrorResponse}
>("products/fetchProduct", async (_, thunkAPI) => {
  try {
    const response = await axios.get("http://localhost:3000/products/get");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return thunkAPI.rejectWithValue(
      axiosError.response?.data || {message: "An error occurred"}
    );
  }
});
