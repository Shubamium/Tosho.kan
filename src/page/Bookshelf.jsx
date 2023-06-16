import { useDispatch, useSelector } from "react-redux"
import { BookView } from "./Search";
import React, { useRef, useState } from "react";
import { Minus, MinusCircleIcon, Plus, PlusCircleIcon, X } from "lucide-react";
import useDrawer from "../hooks/useDrawer";
import { useForm } from "react-hook-form";
import { stringify } from "postcss";
import { shelfActions } from "../toolkit/slice/shelfSlice";

function Bookshelf() {
    const bookShelf = useSelector((state)=>state.shelf.shelf);
    const [showingCategory,setShowingCategory] = useState('planned');
    const editDrawerState = useDrawer();
    const [toEdit,setToEdit] = useState();
    const [simple,setSimple] = useState(false);
    const toRender = [...bookShelf].reverse().map((bookData,index) => {
      if (bookData.category !== showingCategory) return <React.Fragment key={index}></React.Fragment>;
      return (
        <BookView key={bookData.id || index} simplified={simple} readCount={bookData.pageRead} types={'shelf'} onEdit={(id)=>{editDrawerState.open(); setToEdit(id);}} bookData={bookData.bookData} />
      );
    });

    function switchView(to){
      setSimple(to);
    }

    return (
      <div>
          <div className="confine max-w-screen-lg">
            <div className="header flex justify-between items-end">
             <div className="left ">
              <h2 className="text-5xl font-bold mt-8 text-sky-800">My Bookshelf</h2>
              <p className="p-1 mb-5">All of your books in one place.</p>
             </div>
             <div className="right flex h-fit  rounded-xl bg-slate-300">
                <button className={`rounded-xl hover:bg-slate-900 simple btn h-fit bg-transparent ${simple && 'bg-slate-600'}`}  onClick={()=>{switchView(true)}}>Simple</button>
                <button className={`rounded-xl hover:bg-slate-900 simple btn h-fit bg-transparent ${!simple && 'bg-slate-600'}`}    onClick={()=>{switchView(false)}}>Detailed</button>
             </div>
            </div>
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
  const {register,handleSubmit,formState:{errors},setValue,getValues} = useForm();
  const dispatch = useDispatch();
  const bookData = useSelector((state) => state.shelf.shelf[state.shelf.shelf.findIndex((val)=> val.id === toEdit)] || null)

  function submit (e){
    console.log(errors);
    onSubmit && onSubmit(e);
    let progress = parseInt(e.progress);
    if(isNaN(progress)){
      progress = 0;
    }
    const data = {  
        id:toEdit,
        data:{
          pageRead:progress,
          category:e.status
        }
    };
    if(!isNaN(progress)){
      dispatch(shelfActions.update(data));
    }
  }

  const handleFineControl = (val)=>{
      try{
        const num = parseInt(getValues('progress'))
        let res = num + val;
        if(res < 0) res = 0;
        if(bookData.pageCount !== 0 && res > bookData.pageCount) res = bookData.pageCount; 
        if(!isNaN(res)){
          setValue('progress',res,{shouldValidate:true});
        }
      }catch(err){
        console.log(err);
      }
  }
  return (
    <div className="backdrop bg-slate-900 bg-opacity-30 backdrop-blur-[2px] w-screen h-screen fixed top-0 right-0">
        <div className="content h-screen w-1/5 bg-white absolute right-0 p-4">
            <form onSubmit={handleSubmit(submit)} className="flex flex-col justify-between h-full">
              <div className="drawer-header border-b-2 p-2 border-gray-400 flex justify-between">
                <h2 className="text-2xl">Edit Book</h2>
                <button className="btn bg-transparent hover:bg-red-600 hover:text-white text-black" onClick={()=>{close && close()}}><X/></button>
              </div>
              <div className="drawer-body p-2 h-full">
                  <fieldset className="flex flex-col text-lg">
                      <label htmlFor="progress" className="text-lg font-semibold">Progress:</label>
                      <div className="w-full flex p-2 items-center gap-2" >
                        <input className=" bg-sky-100 w-28 p-2 text-2xl text-slate-600" {...register('progress',{min:0,max:bookData.pageCount === 0 ? Infinity : bookData.pageCount,required:true})} defaultValue={bookData.pageRead}  max={bookData.pageCount !== 0 ? bookData.pageCount : ''} placeholder="0"  min={0}/> <p className="text-blue-400 block  text-2xl "> / {bookData.pageCount}</p>
                      </div>
                      <div className="fast-control flex gap-2">
                        <button className="btn"  type="button"  onClick={()=>{handleFineControl(-10)}} >  <MinusCircleIcon/> </button>
                        <button className="btn"  type="button"  onClick={()=>{handleFineControl(-1)}} > <Minus/> </button>
                        <button className="btn"  type="button" onClick={()=>{handleFineControl(1)}} > <Plus></Plus> </button>
                        <button className="btn"  type="button" onClick={()=>{handleFineControl(10)}} > <PlusCircleIcon/> </button>
                      </div>
                      {errors.progress?.type === 'max' && <p>Cannot exceed the amount of pages in the book.</p>}
                  </fieldset>
                  <fieldset className="my-2">
                    <label className="text-lg font-semibold">Status</label>
                    <select {...register('status')} defaultValue={bookData.category}  className="p-2 rounded-sm bg-sky-100 w-full px-4 focus:outline-4 outline-black ">
                      <option value="favorite">Favorite</option>
                      <option value="reading">Reading</option>
                      <option value="completed">Completed</option>
                      <option value="planned">Plan to Read</option>
                      <option value="onhold">On-hold</option>
                    </select>
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

