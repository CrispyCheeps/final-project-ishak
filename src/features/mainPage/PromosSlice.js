import { getPromo } from "@/api/beranda/promoApi";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  promos: [],
  loadingPromo: false,
  error: null,
};

const promosSlice = createSlice({
  name: "promos",
  initialState,
  reducers: {
    setPromos: (state, action) => {
      state.promos = action.payload;
    },
    setLoadingPromo: (state, action) => {
      state.loadingPromo = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setPromos, setLoadingPromo, setError } = promosSlice.actions;
export default promosSlice.reducer;

// promosSlice.js
export const getPromos = () => async (dispatch) => {
    dispatch(setLoadingPromo(true));
    try {
      const res = await getPromo();
      if (res.code === "200") {
        dispatch(setPromos(res.data));
      } else {
        dispatch(setError("Gagal mengambil promo: " + res.message));
      }
      return res; // optional
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoadingPromo(false));
    }
  };
  