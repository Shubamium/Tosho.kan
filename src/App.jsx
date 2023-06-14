import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom";
import Navbar from "./component/Navbar";
function App() {

    const [bookData,setBookData] = useState([]);
    // useEffect(()=>{

    //   async function loadData(){
    //     const req = await fetch('https://www.googleapis.com/books/v1/volumes?q=flowers+algernon&key=' + import.meta.env.VITE_GOOGLE_API +'&maxResults=4');
    //     const res = await req.json();
    //     setBookData(res);
    //   }

    //   loadData();
    // },[])
    return (
        <div>
          <Navbar/>
          <Outlet/>
        </div>
    )
}

export default App
