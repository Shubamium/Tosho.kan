import { useSelector } from "react-redux"
import { BookView } from "./Search";
import { useState } from "react";

function Bookshelf() {

    const bookShelf = useSelector((state)=>state.shelf);
    const [showingCategory,setShowingCategory] = useState('favorite');
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
                  {bookShelf && [...bookShelf].reverse().map((bookData)=>{
                      if(bookData.category !== showingCategory) return <></>;
                      return (
                          <BookView key={bookData.id} types={'shelf'} bookData={bookData.bookData}/>
                      )
                  })}
              </div>
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