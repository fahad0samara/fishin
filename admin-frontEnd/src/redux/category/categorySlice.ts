import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  fetchCategories,
} from "./categoryThunks";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface CategoryState {
  data: Category[];
  loading: boolean;
  error: unknown;
}

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    data: [],
    loading: false,
    error: null,
  } as CategoryState,
  reducers: {},
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
          state.data = action.payload;
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
          state.data.push(action.payload); // Add the new category to the state
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
          state.data = state.data.map(category => {
            if (category.id === action.payload.id) {
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
          state.data = state.data.filter(
            category => category.id !== action.payload
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
