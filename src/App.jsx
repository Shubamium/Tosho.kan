import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom";
import Navbar from "./component/Navbar";
import { useDispatch } from "react-redux";
import { shelfActions } from "./toolkit/slice/shelfSlice";
function App() {
    const dispatch = useDispatch();
    useEffect(()=>{
      console.log('Initializingss stores');
      const data = JSON.parse(localStorage.getItem('shelf'));
      // console.log(data.shelf);
      dispatch(shelfActions.load(data.shelf));
    },[]);
    return (
        <div>
          <Navbar/>
          <Outlet/>
        </div>
    )
}

export default App
