import { Book, Home, Search } from "lucide-react"
import { useRef } from "react"
import { Form, Link, useNavigate } from "react-router-dom"

function Navbar() {

    const navigate = useNavigate();

    function handleSearch(e){
        // e.preventDefault();

        // const formData = new FormData(e);
        // navigate(`/search/${formData.get('q')}`);
    }
  return (
    <header className="bg-blue-400 p-2">
      <div className="confine  flex md:justify-between md:flex-nowrap content-center flex-wrap justify-center gap-2">
            <h1 className="text-4xl text-white"><span className="font-bold">Tosho</span>.kan</h1>
            <Form className="w-full input-field flex gap-2 justify-end pr-10" onClick={handleSearch} method="get" action="/search">
                    <input type="search" name="q" id="" className=" w-9/12 border-2 rounded-full border-blue-300 h-full p-2 px-5"  placeholder="Search books by name or author or ISBN Number. . ."  required/>
                    <button type='submit' className="btn"><Search size={27}/></button>
            </Form>
            <nav className="flex gap-2">
                <Link to={'/'}><button className="btn"> <Home  size={27}/> Home</button></Link>
                <Link to={'/shelf'}><button className="btn"> <Book size={27}/> My Bookshelf</button></Link>
            </nav>
      </div>
    </header>
  )
}

export default Navbar