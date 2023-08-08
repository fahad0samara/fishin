import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  fetchCategories,
} from "./categoryThunks";
import { Key } from "react";

interface Category {
  _id: Key | null | undefined;

  name: string;
  description: string;
}

interface CategoryState {
  category: Category[];
  loading: boolean;
  error: unknown;
  message: string | null;
}

const categorySlice = createSlice({
  name: "category",
  initialState: {
    category: [],
    loading: false,
    error: null,
    message: null,
  } as CategoryState,
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
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.category = action.payload;
        }
      )
      .addCase(
        fetchCategories.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(createCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          state.category.push(action.payload); // Add the new category to the state
        }
      )
      .addCase(
        createCategory.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(updateCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          state.category = state.category.map(category => {
            if (category._id === action.payload._id) {
              return action.payload;
            }
            return category;
          });
        }
      )
      .addCase(
        updateCategory.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(deleteCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCategory.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.category = state.category.filter(
            category => category._id !== action.payload
          );
        }
      )
      .addCase(
        deleteCategory.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
    // ... (similarly handle other async thunks)
  },
});

export default categorySlice.reducer;
export const {clearError, clearMessage} = categorySlice.actions;
