import { createSlice } from '@reduxjs/toolkit';
import { login } from '@/api/authApi';
import { useNavigate } from 'react-router-dom';


const initialState = {
    email : '',
    password : '',
    isLoggedIn : false,
    error: null,
    token: null,
    loading: false,
    profilePictureUrl: '',
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
        setProfilePictureUrl: (state, action) => {
            state.profilePictureUrl = action.payload;
        },
    },
});

// const navigate = useNavigate();

export const {
    setEmail,
    setPassword,
    setIsLoggedIn,
    setError,
    setToken,
    setLoading,
    setProfilePictureUrl,
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
        // if(data.code == 200) {
        //     navigate("")
        // }
        dispatch(setToken(data.token));
        dispatch(setIsLoggedIn(true));
        dispatch(setProfilePictureUrl(data.profilePictureUrl || ''));
        dispatch(setError(null));
        return data;
    } catch(err) {
        const errorMsg = err.response?.data?.message || 'Login gagal';
        dispatch(setError(errorMsg));
        dispatch(setIsLoggedIn(false));
        throw err;
    } finally {
        dispatch(setLoading(false));
    }
};