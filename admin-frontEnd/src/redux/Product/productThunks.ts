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
  FormData,
  {rejectValue: ErrorResponse}
>("products/createProduct", async (formDataWithImages, thunkAPI) => {
  try {
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

// ...
export const fetchProduct = createAsyncThunk<
  { products: Product[]; currentPage: number; totalPages: number }, // Return pagination info
  { page: number; limit: number },
  { rejectValue: ErrorResponse }
>("products/fetchProduct", async ({ page, limit }, thunkAPI) => {
  try {
    const response = await axios.get(`http://localhost:3000/products/get?page=${page}&limit=${limit}`);
    return {
      products: response.data.products,
      currentPage: page,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return thunkAPI.rejectWithValue(
      axiosError.response?.data || { message: "An error occurred" }
    );
  }
});
// ...

