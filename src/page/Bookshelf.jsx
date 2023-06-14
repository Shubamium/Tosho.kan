import { useSelector } from "react-redux"
import { BookView } from "./Search";

function Bookshelf() {

    const bookShelf = useSelector((state)=>state.shelf);
  return (
    <div>
        <div className="confine max-w-screen-lg">
           <h2>My Bookshelf</h2>
           {bookShelf && bookShelf.map((bookData)=>{
                return (
                    <BookView key={bookData.id} bookData={bookData.bookData}/>
                )
           })}
        </div>
    </div>
  )
}

export default Bookshelf