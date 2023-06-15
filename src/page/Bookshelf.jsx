import { useDispatch, useSelector } from "react-redux"
import { BookView } from "./Search";
import React, { useState } from "react";
import { X } from "lucide-react";
import useDrawer from "../hooks/useDrawer";
import { useForm } from "react-hook-form";
import { stringify } from "postcss";
import { shelfActions } from "../toolkit/slice/shelfSlice";

function Bookshelf() {
    const bookShelf = useSelector((state)=>state.shelf.shelf);
    const [showingCategory,setShowingCategory] = useState('favorite');
    const editDrawerState = useDrawer();
    const [toEdit,setToEdit] = useState();
    const toRender = [...bookShelf].reverse().map((bookData,index) => {
      if (bookData.category !== showingCategory) return <React.Fragment key={index}></React.Fragment>;
      return (
        <BookView key={bookData.id || index} readCount={bookData.pageRead} types={'shelf'} onEdit={(id)=>{editDrawerState.open(); setToEdit(id);}} bookData={bookData.bookData} />
      );
    });


    return (
      <div>
          <div className="confine max-w-screen-lg">
            <h2 className="text-5xl font-bold mt-8 text-sky-800">My Bookshelf</h2>
            <p className="p-1 mb-5">All of your books in one place.</p>
            <div className="tabs flex gap-2 border-b-2 border-sky-200">
                      <TabButton toSet={'favorite'}  category={showingCategory}  setShowingCategory={setShowingCategory}>
                        Favorite
                      </TabButton>
                      <TabButton toSet={'reading'}  category={showingCategory}  setShowingCategory={setShowingCategory}>
                        Reading
                      </TabButton>
                      <TabButton toSet={'planned'}  category={showingCategory}  setShowingCategory={setShowingCategory}>
                        Plan to Read
                      </TabButton>
                      <TabButton toSet={'completed'}  category={showingCategory}  setShowingCategory={setShowingCategory}>
                        Completed
                      </TabButton>
                      
            </div>
              <div className="flex flex-col gap-5">
                  {bookShelf && toRender}
                  {toRender.filter((el) => el !== null && el !== undefined).length == 0 || !bookShelf ?  (
                    <>
                      <h2>No books is available yet. Search the books you want and add it, it will show up here!</h2>
                    </>
                  ) : <></>}
              </div>
          </div>

          <EditDrawer visibile={editDrawerState.visible} toEdit={toEdit} close={editDrawerState.close} onSubmit={()=>{editDrawerState.close();}}/>
      </div>
  )
}

function EditDrawer({visibile,page,close,toEdit, onSubmit}){
  if(!visibile){
    return <></>
  }
  const {register,handleSubmit} = useForm();
  const dispatch = useDispatch();
  const bookData = useSelector((state) => state.shelf.shelf[state.shelf.shelf.findIndex((val)=> val.id === toEdit)] || null)

  function submit (e){
    console.log(JSON.stringify(e));
    onSubmit && onSubmit(e);
    const data = {
        id:toEdit,
        data:{
          pageRead:parseInt(e.progress)
        }
    };

    dispatch(shelfActions.update(data));
  }
  console.log(bookData);

  return (
    <div className="backdrop bg-slate-900 bg-opacity-30 backdrop-blur-[2px] w-screen h-screen fixed top-0 right-0">
        <div className="content h-screen w-1/5 bg-white absolute right-0 p-4">
            <form onSubmit={handleSubmit(submit)} className="flex flex-col justify-between h-full">
              <div className="drawer-header border-b-2 p-2 border-gray-400 flex justify-between">
                <h2 className="text-2xl">Edit Book</h2>
                <button className="btn bg-transparent hover:bg-red-600 hover:text-white text-black" onClick={()=>{close && close()}}><X/></button>
              </div>
              <div className="drawer-body p-2 h-full">
              {/* <p>{toEdit}</p> */}
                  <fieldset className="flex flex-col">
                      <label htmlFor="progress">Progress:</label>
                      <div className="w-full flex p-2 items-center gap-2" >
                        <input className=" bg-sky-100 w-28 p-2 text-2xl text-slate-600"  {...register('progress')} required placeholder="0" type="0" /> <p className="text-blue-400 block  text-2xl "> / {bookData.pageCount}</p>
                      </div>
                  </fieldset>
              </div>
              <div className="drawer-footer bg-sky-100 bg-opacity-5 p-2 w-full">
                  <button className="btn">Apply</button>
              </div>
            </form>
        </div>
    </div>
  )
}

function TabButton({category,toSet,setShowingCategory,children}){
  return (
    <button className={`${category === toSet ? 'bg-sky-200' : 'bg-sky-100'} btn p-2 px-5 rounded-none text-slate-800 font-light hover:bg-sky-300 rounded-t-md`} onClick={()=>{setShowingCategory(toSet)}}>{children}</button>
  )
}
export default Bookshelf