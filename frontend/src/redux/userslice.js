import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customFetch from "../utils/axios";
import {
  addTokenToLocalStorage,
  getTokenFromLocalStorage,
} from "../utils/localStorage";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, { rejectWithValue }) => {
    console.log(user)
    try {
      const resp = await customFetch.post("/login", user);

      return resp.data;
    } catch (error) {
      console.log(error);
      if (!error.response) {
        toast.error(error.message);
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const initialState = {
  token: getTokenFromLocalStorage(),
  isLoading: false,
};
const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        console.log(payload);
        state.isLoading = false;
        state.token = payload.token;
        console.log(payload.token);
        addTokenToLocalStorage(payload.token);
        toast.success("login successfully");
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        const error = payload;
        toast.error(error);
        state.isLoading = false;
      });
  },
});
export default userSlice.reducer;
