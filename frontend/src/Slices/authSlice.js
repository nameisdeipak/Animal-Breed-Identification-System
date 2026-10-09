import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../utils/axiosClient";
import toast from "react-hot-toast";

export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/auth/checkAuth");
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",

  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/register", formData);

      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
      return rejectWithValue(error);
    }
  },
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",

  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/login", formData);
      toast.success(response?.data.message || "Welcome back!");
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid Credentials";
      toast.error(errorMsg);
      return rejectWithValue(error.response?.data);
    }
  },
);

// LOGOUT
// export const logoutUser = createAsyncThunk(
//   "auth/logoutUser",

//   async (_, { rejectWithValue }) => {
//     try {
//       await axiosClient.post("/auth/logout");

//       return null;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   },
// );

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",

  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/auth/logout");
      console.log(response);
      toast.success(response.data);

      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },

  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.user;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const{updateUser}=authSlice.actions;
export default authSlice.reducer;
