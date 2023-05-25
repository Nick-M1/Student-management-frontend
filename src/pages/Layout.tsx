import "@fontsource/montserrat";

import {Link, NavLink, Outlet, useLocation, useParams} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import React from "react";
import {LOGO_PNG} from "../constants/assets-constants";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import Breadcrumb from "../components/shared/Breadcrumb";

export default function Layout() {
    const path = useLocation().pathname.split('/').slice(1)
    const breadcrumbs = path.map((p, index) => {
        return {
            title: `${p}`,
            link: `/${path.slice(0, index + 1).join('/')}`,
        }
    })

    return (
        <div className='font-montserrat scrollbar min-h-screen bg-gray-100 text-gray-900 py-6 px-4 sm:px-6 lg:px-32'>
            <Toaster/>
            <div className="mx-auto text-3xl font-bold flex tracking-wide">
                <Link to='/'>
                    <img src={LOGO_PNG} className='w-20 h-20 mr-3' alt='logo' title='Student Management System'/>
                </Link>
                Student Management <br/> System

                <div className='flex-grow'/>
                <NavLink to='/courses' className={({isActive}) => `text-lg flex items-start smooth-transition ${isActive ? 'text-blue-500' : 'text-black hover:text-blue-600 active:text-blue-400'}`}>
                    Courses <ArrowRightIcon className='w-5 mt-1 ml-2'/>
                </NavLink>
            </div>

            <Breadcrumb breadcrumbs={breadcrumbs}/>
            <Outlet/>
        </div>
    )
}