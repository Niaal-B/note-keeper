import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken : localStorage.getItem("access_token") || null,
    refreshToken : localStorage.getItem("refreshToken") || null,
    isAuthenticated : !!localStorage.getItem("access_token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null, 

}

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        login : (state,action) => {
            state.accessToken = action.payload.access;
            state.refreshToken = action.payload.refresh;
            state.isAuthenticated = true
            state.user = action.payload.user || null;
            localStorage.setItem("access_token", action.payload.access);
            localStorage.setItem("refresh_token", action.payload.refresh);
            if (action.payload.user) {
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            }

      
        },
        logout : (state) =>{
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        },
        refreshToken: (state, action) => {
            state.accessToken = action.payload;
            localStorage.setItem("access_token", action.payload);
          },
    }
})


export const { login, logout, refreshToken } = authSlice.actions;
export default authSlice.reducer;