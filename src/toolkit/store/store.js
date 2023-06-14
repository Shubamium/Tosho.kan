import { configureStore } from "@reduxjs/toolkit";
import { shelfReducer } from "../slice/shelfSlice";

const store = configureStore({
    reducer:{
        shelf:shelfReducer
    }
})


export default store;