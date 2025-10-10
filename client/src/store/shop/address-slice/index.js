import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: [],
};

// Dynamic API base URL (from Vite .env)
const API_URL = import.meta.env.VITE_API_URL;

// CRUD async thunks
export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData) => {
    const response = await axios.post(`${API_URL}/api/shop/address/add`, formData);
    return response.data;
  }
);

export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async (userId) => {
    const response = await axios.get(`${API_URL}/api/shop/address/get/${userId}`);
    return response.data;
  }
);

export const editaAddress = createAsyncThunk(
  "/addresses/editaAddress",
  async ({ userId, addressId, formData }) => {
    const response = await axios.put(`${API_URL}/api/shop/address/update/${userId}/${addressId}`, formData);
    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }) => {
    const response = await axios.delete(`${API_URL}/api/shop/address/delete/${userId}/${addressId}`);
    return response.data;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => { state.isLoading = true; })
      .addCase(addNewAddress.fulfilled, (state) => { state.isLoading = false; })
      .addCase(addNewAddress.rejected, (state) => { state.isLoading = false; })
      .addCase(fetchAllAddresses.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  },
});

export default addressSlice.reducer;
