import { createSlice } from '@reduxjs/toolkit';
import { login } from '@/api/authApi';


const initialState = {
    email : '',
    password : '',
    isLoggedIn : false,
    error: null,
    token: null,
    loading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        },

        setPassword: (state, action) => {
            state.password = action.payload;
        },

        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },

        setToken: (state, action) => {
            state.token = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const {
    setEmail,
    setPassword,
    setIsLoggedIn,
    setError,
    setToken,
    setLoading,
} = authSlice.actions;
export default authSlice.reducer;

export const loginUser = (email, password) => async (dispatch) => {
    console.log('loginUser called with:', email, password);
    if (!email || !password) {
        dispatch(setError('Email dan password harus diisi'));
        return;
    }
    dispatch(setLoading(true));
    try {
        console.log('Attempting to login with:', email, password);
        const data = await login(email, password);
        console.log(data);
        dispatch(setToken(data.token));
        dispatch(setIsLoggedIn(true));
        dispatch(setError(null));
    } catch(err) {
        const errorMsg = err.response?.data?.message || 'Login gagal';
        dispatch(setError(errorMsg));
        dispatch(setIsLoggedIn(false));
    } finally {
        dispatch(setLoading(false));
    }
};