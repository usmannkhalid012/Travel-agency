import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createBus, deleteBus, fetchBuses, fetchPopularRoutes, updateBus } from '../../services/busService';

export const loadBuses = createAsyncThunk('buses/load', async (params, thunkAPI) => {
  try {
    return await fetchBuses(params);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const loadPopularRoutes = createAsyncThunk('buses/popularRoutes', async (_, thunkAPI) => {
  try {
    return await fetchPopularRoutes();
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const createBusAsync = createAsyncThunk('buses/create', async (payload, thunkAPI) => {
  try {
    const response = await createBus(payload);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Failed to create bus');
  }
});

export const updateBusAsync = createAsyncThunk('buses/update', async ({ id, payload }, thunkAPI) => {
  try {
    const response = await updateBus(id, payload);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Failed to update bus');
  }
});

export const deleteBusAsync = createAsyncThunk('buses/delete', async (id, thunkAPI) => {
  try {
    const response = await deleteBus(id);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Failed to delete bus');
  }
});

const busSlice = createSlice({
  name: 'buses',
  initialState: {
    list: [],
    popularRoutes: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    selectedBus: null,
    status: 'idle',
    createStatus: 'idle',
    createError: null,
    updateStatus: 'idle',
    updateError: null,
    deleteStatus: 'idle',
    deleteError: null
  },
  reducers: {
    setSelectedBus(state, action) {
      state.selectedBus = action.payload;
    },
    setBusImage(state, action) {
      const { id, image } = action.payload;
      const index = state.list.findIndex((b) => b._id === id);
      if (index !== -1) state.list[index].image = image;
    },
    clearCreateError(state) {
      state.createError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBuses.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.meta = action.payload.meta || state.meta;
      })
      .addCase(loadPopularRoutes.fulfilled, (state, action) => {
        state.popularRoutes = action.payload.data;
      })
      // Create Bus
      .addCase(createBusAsync.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createBusAsync.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.list.push(action.payload.data);
      })
      .addCase(createBusAsync.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload || 'Failed to create bus';
      })
      // Update Bus
      .addCase(updateBusAsync.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateBusAsync.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.list.findIndex((bus) => bus._id === action.payload.data._id);
        if (index !== -1) state.list[index] = action.payload.data;
      })
      .addCase(updateBusAsync.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload || 'Failed to update bus';
      })
      // Delete Bus
      .addCase(deleteBusAsync.pending, (state) => {
        state.deleteStatus = 'loading';
        state.deleteError = null;
      })
      .addCase(deleteBusAsync.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        const id = action?.meta?.arg;
        if (id) state.list = state.list.filter((bus) => bus._id !== id);
      })
      .addCase(deleteBusAsync.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.payload || 'Failed to delete bus';
      });
  }
});

export const { setSelectedBus, setBusImage, clearCreateError } = busSlice.actions;
export default busSlice.reducer;