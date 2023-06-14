import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/main.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import Home from './page/Home.jsx'
import Search from './page/Search.jsx'
const routes = createBrowserRouter([
  {
    element:<App/>,
    children:[
      {
        path:'/',
        element:<Home/>
      },
      {
        path:'/search',
        element:<Search/>
      }
    ]
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={routes}></RouterProvider>
  </React.StrictMode>
)
