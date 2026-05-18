import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    mobileSidebarOpen: false,
    loading: false
  },
  reducers: {
    toggleSidebar(state) {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    }
  }
});

export const { toggleSidebar, setLoading } = uiSlice.actions;
export default uiSlice.reducer;