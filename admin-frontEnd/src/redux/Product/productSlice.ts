import {createSlice, PayloadAction} from "@reduxjs/toolkit";

import { Key } from "react";
import { createProduct, deleteProduct, fetchProduct, updateProduct } from "./productThunks";

interface product {
  _id: Key | null | undefined;

  name: string;
  price: number;
  category: string;
  description: string;
  images: File[];
  brand: string;
  selectedColors: string[];
  selectedSizes: string[];
}

interface productState {
  product: product[];
  loading: boolean;
  error: unknown;
  message: string | null;
}

const productSlice = createSlice({
  name: "product",
  initialState: {
    product: [],
    loading: false,
    error: null,
    message: null,
  } as productState,
    reducers: {
        clearError(state) {
            state.error = null;
        }
        ,
        clearMessage(state) {
            state.message = null;
        }

  },
  extraReducers: builder => {
    builder
      .addCase(fetchProduct.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProduct.fulfilled,
        (state, action: PayloadAction<product[]>) => {
          state.loading = false;
          state.product = action.payload;
        }
      )
      .addCase(
        fetchProduct.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(createProduct.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<product>) => {
          state.loading = false;
          state.product.push(action.payload); // Add the new product to the state
        }
      )
      .addCase(
        createProduct.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(updateProduct.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<product>) => {
          state.loading = false;
          state.product = state.product.map(product => {
            if (product._id === action.payload._id) {
              return action.payload;
            }
            return product;
          });
        }
      )
      .addCase(
        updateProduct.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(deleteProduct.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.product = state.product.filter(
            product => product._id !== action.payload
          );
        }
      )
      .addCase(
        deleteProduct.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
    // ... (similarly handle other async thunks)
  },
});

export default productSlice.reducer;
export const {clearError, clearMessage} = productSlice.actions;
