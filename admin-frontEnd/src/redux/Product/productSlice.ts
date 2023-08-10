import {createSlice, PayloadAction} from "@reduxjs/toolkit";


import { createProduct, deleteProduct, fetchProduct, updateProduct } from "./productThunks";
import { Product } from "../../type";



interface productState {
  product: Product[];
  loading: boolean;
  error: unknown;
  message: string | null;
  currentPage: number;
  totalPages: number;
}

const productSlice = createSlice({
  name: "product",
  initialState: {
    product: [],
    loading: false,
    error: null,
    message: null,
    currentPage: 1,
    totalPages: 1,
    
    
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
        (
          state,
          action: PayloadAction<{
            products: Product[];
            currentPage: number;
            totalPages: number;
          }>
        ) => {
          state.loading = false;
          state.product = action.payload.products;
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
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
        (state, action: PayloadAction<Product>) => {
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
        (state, action: PayloadAction<Product>) => {
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
        (state, action: PayloadAction<unknown>) => {
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
