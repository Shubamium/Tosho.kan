import { useSelector } from "react-redux"
import { BookView } from "./Search";

function Bookshelf() {

    const bookShelf = useSelector((state)=>state.shelf);
  return (
    <div>
        <div className="confine max-w-screen-lg">
           <h2>My Bookshelf</h2>
            <div className="flex flex-col gap-5">
                {bookShelf && bookShelf.map((bookData)=>{
                    return (
                        <BookView key={bookData.id} bookData={bookData.bookData}/>
                    )
            })}
            </div>
        </div>
    </div>
  )
}

export default Bookshelf