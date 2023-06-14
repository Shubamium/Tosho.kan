import { createSlice } from "@reduxjs/toolkit";


const shelfSlice = createSlice({
    name:'shelf',
    initialState:[],
    reducers:{
        add:(state,action)=>{
            state.push(action.payload);
        }
    }
})

export const shelfReducer = shelfSlice.reducer;

export const shelfActions = shelfSlice.actions;