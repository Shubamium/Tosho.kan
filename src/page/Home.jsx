import { useDispatch, useSelector } from "react-redux"
import { shelfActions } from "../toolkit/slice/shelfSlice";
import { BookView, BookviewSkeleton } from "./Search";
import { useAIRecommendation } from "../hooks/useAIRecommendation";

function Home() {

  const recentlyAdded = useSelector((state)=>{
    const filtered = [...state.shelf.shelf].reverse().filter((data,index)=> index < 8);
    return filtered
  });

  const {loading,recommendation,error} = useAIRecommendation(recentlyAdded.map(data => data.bookData.title).join(', '),JSON.parse(localStorage.getItem('recc_refreshed')));

  return (
    <main className="">
      <article className=" bg-blue-400  p-20 overflow-hidden">
        <div className="confine max-w-screen-lg text-white">
            <h2 className="text-6xl font-bold">Welcome to Toshokan </h2>
            <p className="text-zinc-700 p-2 text-lg">Search and manage the book you read </p>
            <div className="decor_circle bg-blue-400 rounded-3xl w-full h-32 absolute  right"></div>
        </div>
      </article>
       <div className="content mt-32 pb-40">
         <div className="confine">
            <h2 className="text-slate-800 text-2xl font-semibold">Recently Added:</h2>
            <p>Get back on to what you just read!</p>
            <div className="recent flex gap-4 overflow-x-auto whitespace-nowrap p-4">
                {recentlyAdded && recentlyAdded.map((book)=>{
                  return <BookView  key={book.id} isPotrait={true} simplified={true}  readCount={book.pageRead} types={'shelf'} bookData={book.bookData}/>
                })}
            </div>
          </div>
          <div className="confine mt-20">
                {recentlyAdded.length > 0 && (
                       <section>
                       <h2 className="text-slate-800 text-2xl font-semibold">Recommendation</h2>
                       <p>Don't know what to read? Here's some books that you might find interesting based on what you've read already!</p>
                         <div className="recommendation">
                            <div className="flex justify-between my-2">
                            </div>
                             <div className="search-res flex flex-col gap-4">
                                 {!loading && recommendation && recommendation.map((res)=>{
                                     return (
                                         <BookView key={res.id} bookData={res}/>
                                     )
                                 })}
                                 {loading && (
                                     <>
                                         <BookviewSkeleton/>
                                         <BookviewSkeleton/>
                                         <BookviewSkeleton/>
                                         <BookviewSkeleton/>
                                     </>
                                 )}
                             </div>
                         </div>
                   
                     </section>
                )}
                {error && <p className="text-red-500 animate-pulse p-2">{error}</p>}
          </div>
       </div>
    </main>
  )
}

export default Home