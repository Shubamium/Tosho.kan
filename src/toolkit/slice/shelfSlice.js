import { createSlice, current } from "@reduxjs/toolkit";

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
        update:(state,action)=>{
            const selectedIndex = state.shelf.findIndex((shelf)=> shelf.id === action.payload.id);
            const shelf = [...state.shelf];
            shelf[selectedIndex] = {...shelf[selectedIndex],...action.payload.data};
            console.log(selectedIndex);
            // console.log(state.shelf[selectedIndex]);
           state.shelf = shelf;
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