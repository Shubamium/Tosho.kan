import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/main.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import Home from './page/Home.jsx'
import Search from './page/Search.jsx'
import Bookshelf from './page/Bookshelf.jsx'
import { Provider } from 'react-redux'
import store from './toolkit/store/store.js'
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
      },
      {
        path:'/shelf',
        element:<Bookshelf/>
      }
    ]
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes}></RouterProvider>
    </Provider>
  </React.StrictMode>
)
