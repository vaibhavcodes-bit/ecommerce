import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Dynamic API base URL (from Vite .env files)
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  isLoading: false,
  featureImageList: [],
};

// =============== ASYNC THUNKS ===============

// Get Feature Images
export const getFeatureImages = createAsyncThunk(
  "common/getFeatureImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/common/feature/get`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch images");
    }
  }
);

// Add Feature Image
export const addFeatureImage = createAsyncThunk(
  "common/addFeatureImage",
  async (image, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/common/feature/add`, { image });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add image");
    }
  }
);

// =============== SLICE ===============
const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Images
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      })

      // Add Image
      .addCase(addFeatureImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false;
        // optional: push new image to list if backend returns it
        if (action.payload.data) {
          state.featureImageList.push(action.payload.data);
        }
      })
      .addCase(addFeatureImage.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default commonSlice.reducer;
