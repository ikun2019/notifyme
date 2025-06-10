import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user.name = action.payload.name;
        if (action.payload.avatarUrl) {
          state.user.avatarUrl = action.payload.avatarUrl;
        }
      }
    },
  }
});

export const { login, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
