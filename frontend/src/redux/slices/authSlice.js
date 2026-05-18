import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchMe, loginUser, logoutUser, registerUser } from '../../services/authService';
import { clearApiToken, setApiToken } from '../../services/api';
import toast from 'react-hot-toast';

const user = JSON.parse(localStorage.getItem('user') || 'null');

export const login = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  try {
    return await loginUser(payload);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const register = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  try {
    return await registerUser(payload);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, thunkAPI) => {
  try {
    return await fetchMe();
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    return await logoutUser();
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user,
    status: 'idle',
    error: null
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearAuth(state) {
      state.user = null;
      localStorage.removeItem('user');
      clearApiToken();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.data;
        localStorage.setItem('user', JSON.stringify(action.payload.data));
        setApiToken(action.payload.meta?.token || null);
        toast.success(action.payload.message);
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.data;
        localStorage.setItem('user', JSON.stringify(action.payload.data));
        setApiToken(action.payload.meta?.token || null);
        toast.success(action.payload.message);
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
        localStorage.setItem('user', JSON.stringify(action.payload.data));
        setApiToken(action.payload.meta?.token || null);
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.user = null;
        localStorage.removeItem('user');
        clearApiToken();
        toast.success(action.payload.message);
      })
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload;
          toast.error(action.payload || 'Authentication failed');
        }
      );
  }
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;