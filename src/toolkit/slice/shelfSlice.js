import { createSlice } from "@reduxjs/toolkit";

const shelfSlice = createSlice({
    name:'shelf',
    initialState:{shelf:[]},
    reducers:{
        add:(state,action)=>{
            state.shelf.push(action.payload);
            localStorage.setItem('shelf',JSON.stringify(state));
        },
        remove:(state,action)=>{
            const selectedIndex = state.shelf.findIndex((shelf)=> shelf.id === action.payload);
            state.shelf.splice(selectedIndex,1);
            localStorage.setItem('shelf',JSON.stringify(state));
        },
        load:(state,action)=>{
            state.shelf = action.payload;
        }
    }
})

export function loadShelf(){
    // const storageData = localStorage.getItem('shelf');
    // store.dispatch(shelfActions.load(JSON.parse(storageData)));
}
export const shelfReducer = shelfSlice.reducer;

export const shelfActions = shelfSlice.actions;