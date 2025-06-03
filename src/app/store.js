// store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import promosReducer from '../features/mainPage/PromosSlice'; // Assuming promosReducer is imported from the promos slice
import menuReducer from '../features/mainPage/MenuSlice'; // Assuming menuReducer is imported from the menu slice

export const store = configureStore({
    reducer : {
        auth: authReducer,
        promos: promosReducer, // Assuming promosReducer is imported from the promos slice
        menu: menuReducer,
    },
});