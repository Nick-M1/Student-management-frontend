import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {LayoutHeader, layoutHeaderLoader} from "./layout/LayoutHeader";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route errorElement={<ErrorPage/>}>
            <Route path='/signin' lazy={() => import('./routes/SigninRoute')}/>

            <Route element={<LayoutHeader/>} loader={layoutHeaderLoader}>
                <Route index lazy={() => import("./routes/HomeRoute")} />
                <Route path='/courses' lazy={() => import('./routes/CoursesRoute')}/>

                <Route path='/students' lazy={() => import("./routes/StudentsAllRoute")} />
                <Route path='/students/:studentId' lazy={() => import("./routes/StudentDetailedRoute")} />
            </Route>
        </Route>
    )
)


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
