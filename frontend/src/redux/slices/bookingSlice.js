import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cancelBooking, createBooking, fetchAllBookings, fetchMyBookings } from '../../services/bookingService';

export const loadMyBookings = createAsyncThunk('bookings/loadMine', async (_, thunkAPI) => {
  try {
    return await fetchMyBookings();
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    list: [],
    status: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadMyBookings.fulfilled, (state, action) => {
      state.list = action.payload.data;
    });
  }
});

export default bookingSlice.reducer;