import "@fontsource/montserrat";

import {Link, Outlet} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import React from "react";
import {LOGO_PNG} from "../constants/assets-constants";

export default function Layout() {
    return (
        <div className='font-montserrat scrollbar min-h-screen bg-gray-100 text-gray-900 py-6 px-4 sm:px-6 lg:px-32'>
            <Toaster/>
            <h1 className="mx-auto text-3xl font-bold flex tracking-wide pb-6 ">
                <Link to='/'>
                    <img src={LOGO_PNG} className='w-20 h-20 mr-3' alt='logo' title='Student Management System'/>
                </Link>
                Student Management <br/> System
            </h1>
            <Outlet/>
        </div>
    )
}