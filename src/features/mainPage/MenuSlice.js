import { createSlice } from "@reduxjs/toolkit";


//initialState
const initialState = {
    menu: "promos",
}

//Create a slice for menu
const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        setMenu: (state, action) => {
            state.menu = action.payload;
        },
    },
});
export const { setMenu } = menuSlice.actions;
export default menuSlice.reducer;

export const setActiveMenu = (menu) => (dispatch) => {
    dispatch(setMenu(menu));
};
//API