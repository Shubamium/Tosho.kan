import axios from "axios";
import { useEffect, useState } from "react";
import { useFormAction, useLocation, useSearchParams } from "react-router-dom"


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
                thumbnail:book.volumeInfo?.imageLinks?.thumbnail
            }
        })
        return toReturn;
    }
    return (
        <main>
            <div className="confine">
                    <p>Searching for '{query.get('q')}' </p>
                    <div className="search-res flex flex-col gap-2">
                    {searchRes && searchRes.map((res)=>{
                        return (
                            <div className="search-result_book border-sky-00 border-2 bg-sky-50 p-5
                            grid grid-cols-10">  
                                <div className="img-part col-span-2 px-10">
                                   { res.thumbnail ? <img src={res.thumbnail} alt="" className="w-full p-2 max-h-1/2 drop-shadow-md"  />:
                                     <div className="w-full h-full bg-sky-200 flex flex-col justify-center content-center potrait">
                                         <p className="text-sky-800 text-center">No Preview Available</p>
                                     </div>
                                   }
                                </div>
                                <div className="data col-span-8">
                                    <p className="opacity-50">{res.id}</p>
                                    <h2 className="text-2xl font-semibold">{res.title}</h2>
                                    <p>Published on {res.publishedDate}</p>
                                    <p>{res.pageCount} Pages </p>
                                    <p>by {res.authors && res.authors.map((author,index)=> <span> {index > 0 && ','}  {author} </span>)}</p>
                                </div>
                            </div>
                        )
                    })}
                    </div>
            </div>
        </main>
  )
}

export default Search