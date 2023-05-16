import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Layout from "./pages/Layout";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Layout/>} errorElement={<ErrorPage/>}>
            <Route index lazy={() => import("./routes/TableRoute")} />
            <Route path='/student/:studentId' lazy={() => import("./routes/StudentDetailedRoute")} />
        </Route>
    )
)


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
