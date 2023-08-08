import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  darkmode: false,
};

const darkModeSlice = createSlice({
  name: "darkmode",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkmode = !state.darkmode;
    },
  },
});

export const {toggleDarkMode} = darkModeSlice.actions;

export default darkModeSlice.reducer;
