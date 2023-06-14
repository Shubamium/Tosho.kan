import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useFormAction, useLocation, useSearchParams } from "react-router-dom"
import { shelfActions } from "../toolkit/slice/shelfSlice";
import { PlusCircleIcon, ShoppingCartIcon, View } from "lucide-react";


async function book_search(query,callback){
    const searchUrl = new URL('https://www.googleapis.com/books/v1/volumes');
    searchUrl.searchParams.append('q',query);
    searchUrl.searchParams.append('key',import.meta.env.VITE_GOOGLE_API);
    console.log(searchUrl);
    const req = await axios.get(searchUrl);
    callback(req.data);
    
}
function Search() {
   const [query,_] = useSearchParams();

   const dispatch = useDispatch();
   const [searchRes,setSearchRes] = useState();
    useEffect(()=>{
         const q = query.get('q');
        book_search(q,(res)=>{
            setSearchRes(parseResult(res));
        })
    },[query]);


    function parseResult(apiRes){
        let toReturn = [];
        toReturn = apiRes.items.map((book)=>{
            return {
                id:book.id,
                title:book.volumeInfo.title,
                publishedDate:book.volumeInfo.publishedDate,
                pageCount:book.volumeInfo.pageCount,
                authors:book.volumeInfo.authors,
                thumbnail:book.volumeInfo?.imageLinks?.thumbnail,
                description:book.volumeInfo?.description,
                identifier:book.volumeInfo.industryIdentifiers
            }
        })
        return toReturn;
    }
    return (
        <main>
            <div className="confine">
                    <p>Searching for '{query.get('q')}' </p>
                    <div className="search-res flex flex-col gap-4">
                    {searchRes && searchRes.map((res)=>{
                        return (
                            <BookView key={res.id} bookData={res}/>
                        )
                    })}
                    </div>
            </div>
        </main>
  )
}

export function BookView({bookData}){
    const dispatch = useDispatch();
    return (
        <div  className="search-result_book border-sky-00 border-2 bg-sky-50 pr-6 py-6
        grid grid-cols-10 rounded-md shadow-sm">  
            <div className="img-part col-span-2 px-10 ">
               { bookData.thumbnail ? <img src={bookData.thumbnail} alt="" className="w-full p-2 max-h-1/2 drop-shadow-md"  />:
                 <div className="w-full h-full bg-sky-200 flex flex-col justify-center content-center potrait">
                     <p className="text-sky-800 text-center">No Preview Available</p>
                 </div>
               }
            </div>
            <div className="data col-span-8">
                <p className="opacity-50"> {(bookData.identifier && 'ISBN - ' + bookData.identifier[1]?.identifier) || bookData.id}</p>
                <h2 className="text-2xl font-semibold">{bookData.title}</h2>
                <p>Published on {bookData.publishedDate}</p>
                <p className="text-slate-500 text-sm mb-5 p-2 bg-slate-200">{bookData.description || 'No description is available for this book.'}</p>
                <p>{bookData.pageCount} Pages </p>
                <p>by {bookData.authors && bookData.authors.map((author,index)=> <span className="font-bold text-slate-500"> {index > 0 && ','}  {author} </span>)}</p>
                <div className="action flex gap-3">
                    <button className="btn my-2 shadow-md" onClick={()=>{dispatch(shelfActions.add({id:bookData.id,pageRead:0,pageCount:bookData.pageCount,bookData:bookData}))}}><PlusCircleIcon size={27}/> Add To Read</button>
                    <button className="btn my-2 bg-sky-500 shadow-md" onClick={()=>{dispatch(shelfActions.add({id:bookData.id,pageRead:0,pageCount:bookData.pageCount,bookData:bookData}))}}><ShoppingCartIcon size={27}/> Buy</button>
                    <button className="btn my-2 bg-teal-500 shadow-md" onClick={()=>{dispatch(shelfActions.add({id:bookData.id,pageRead:0,pageCount:bookData.pageCount,bookData:bookData}))}}><View size={27}/> More Info</button>
                </div>
            </div>
        </div>
    )
}
export default Search