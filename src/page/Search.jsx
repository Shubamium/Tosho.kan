import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormAction, useLocation, useSearchParams } from "react-router-dom"
import { shelfActions } from "../toolkit/slice/shelfSlice";
import { ArrowBigDown, ArrowBigRightDash, BookMarked, Cross, CrossIcon, CrosshairIcon, Edit, LucideCross, PlusCircleIcon, ShoppingCartIcon, View, X } from "lucide-react";


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
   const [loading,setLoading] = useState(false);
    useEffect(()=>{
        setLoading(true);
        const q = query.get('q');
        book_search(q,(res)=>{
            setSearchRes(parseResult(res));
            setLoading(false);
        })
    },[query]);


    function parseResult(apiRes){
        let toReturn = [];
        if(!apiRes.items) return [];
        toReturn = apiRes.items.map((book)=>{
            return {
                id:book.id,
                title:book.volumeInfo.title,
                publishedDate:book.volumeInfo.publishedDate,
                pageCount:book.volumeInfo.pageCount || 0,
                authors:book.volumeInfo.authors,
                thumbnail:book.volumeInfo?.imageLinks?.thumbnail,
                description:book.volumeInfo?.description,
                identifier:book.volumeInfo.industryIdentifiers,
                actionLink:{
                    buy:book.saleInfo.buyLink,
                    preview:book.volumeInfo.previewLink,
                    info:book.volumeInfo.infoLink
                }
            }
        })
        return toReturn;
    }
    return (
        <main>
            <div className="confine">
                    <div className="flex justify-between my-2">
                        <p className="text-xl p-2 mb-5">Showing search results for <span className="font-bold">'{query.get('q')}'</span>. . . </p>
                        <p className="text-xl p-2 opacity-50 text-right">{searchRes && `${searchRes.length} Results found `}</p>
                    </div>
                    <div className="search-res flex flex-col gap-4">
                        {!loading && searchRes && searchRes.map((res)=>{
                            return (
                                <BookView key={res.id} bookData={res}/>
                            )
                        })}
                        {loading && (
                            <>
                                <BookviewSkeleton/>
                                <BookviewSkeleton/>
                                <BookviewSkeleton/>
                            </>
                        )}
                    </div>
            </div>
        </main>
  )
}

export function BookviewSkeleton(){
    return (
        <div className="skeleton animate-pulse">
                                   <div  className="search-result_book border-sky-00 border-2 bg-sky-50 pr-6 py-6
                                                     grid grid-cols-10 rounded-md shadow-sm">  
                                        <div className="img-part col-span-2 px-10 ">
                                            <div className="w-full h-full bg-slate-200 flex flex-col justify-center content-center potrait">
                                            </div>
                                        </div>
                                        <div className="data col-span-8">
                                            <p className="opacity-50 bg-slate-300 text-transparent w-fit
                                            my-2 rounded-none"> aaaaaaaaaaaaa</p>
                                            <h2 className="text-2xl font-semibold w-fit text-transparent rounded-md bg-slate-300">bookData.title</h2>
                                            <p className="text-transparent bg-slate-300 w-fit my-2">Published on 2099</p>
                                            <p className="text-sm mb-5 p-2 bg-slate-200 min-h-[150px] text-transparent">'No description is available for this book.'</p>
                                           <div className="flex gap.2">
                                                <button className="btn my-2 shadow-md bg-slate-400 text-transparent" disabled > Add To Read</button>
                                                <button className="btn my-2 shadow-md bg-slate-400 text-transparent" disabled > Add To Read</button>
                                                <button className="btn my-2 shadow-md bg-slate-400 text-transparent" disabled > Add To Read</button>
                                                <button className="btn my-2 shadow-md bg-slate-400 text-transparent" disabled > Add To Read</button>
                                           </div>
                                        </div>
                                    </div>
        </div>
    )
}
export function BookView({bookData,readCount,types,onEdit}){
    const dispatch = useDispatch();
    const isOnShelf = useSelector((state) => state.shelf.shelf.findIndex((val)=> val.id === bookData.id) === -1)
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
                <p className="opacity-50 animate"> {(bookData.identifier && 'ISBN - ' + bookData.identifier[0].identifier) || bookData.id}</p>
                <h2 className="text-2xl font-semibold">{bookData.title}</h2>
                <p>Published on {bookData.publishedDate}</p>
                {!types && <p>{bookData.pageCount} Pages </p>}
                <p>by {bookData.authors && bookData.authors.map((author,index)=> <span className="font-bold text-slate-500"> {index > 0 && ','}  {author} </span>)}</p>
                <p className="text-slate-500 text-sm mb-5 p-2 bg-slate-200">{bookData.description || 'No description is available for this book.'}</p>
                {types === 'shelf' &&  (
                    <div className="progress p-2 bg-sky-100">
                        <h2 >Progress:</h2>
                        <p className="text-2xl text-blue-500"> {readCount || 0} / {bookData.pageCount} Pages Read </p>
                    </div>
                )}
              
              {!types && <div className="action flex gap-3">
                    {
                        isOnShelf && (
                            <button className="btn my-2 shadow-md" onClick={()=>{dispatch(shelfActions.add({id:bookData.id,category:'planned',pageRead:0,pageCount:bookData.pageCount,bookData:bookData}))}}><PlusCircleIcon size={27}/> Add To Read</button>
                        )
                    }
                    {bookData.actionLink.buy && <a href={bookData.actionLink.buy || ''} target="_blank">
                        <button className="btn my-2 bg-sky-500 shadow-md" ><ShoppingCartIcon size={27}/> Buy</button>
                    </a>}
                    {bookData.actionLink.preview && <a href={bookData.actionLink.preview || ''} target="_blank">
                        <button className="btn my-2 bg-slate-500 shadow-md" ><View size={27}/> Preview</button>
                    </a>}
                    {bookData.actionLink.info && <a href={bookData.actionLink.info || ''} target="_blank">
                        <button className="btn my-2 bg-sky-500 shadow-md" ><ArrowBigRightDash size={30}/>More Info</button>
                    </a>}
                </div>}

                {types === 'shelf' &&  <div className="action flex gap-3">
                    <button className="btn my-2 shadow-md" onClick={()=>{onEdit && onEdit(bookData.id)}}><Edit size={27}/> Edit</button>
                    <button className="btn my-2 shadow-md bg-orange-500" onClick={()=>{dispatch(shelfActions.remove(bookData.id))}}><X size={29}/> Remove</button>
                    {/* {bookData.actionLink.info && <a href={bookData.actionLink.info || ''} target="_blank">
                        <button className="btn my-2 bg-sky-500 shadow-md" ><ArrowBigRightDash size={30}/>More Info</button>
                    </a>} */}
                </div>}
            </div>
        </div>
    )
}
export default Search