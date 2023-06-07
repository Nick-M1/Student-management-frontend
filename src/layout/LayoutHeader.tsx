import "@fontsource/montserrat";

import {
    Link,
    Navigate,
    NavLink,
    Outlet,
    redirect,
    useLoaderData,
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import React from "react";
import {LOGO_PNG} from "../constants/assets-constants";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import Breadcrumb from "../components/shared/Breadcrumb";
import {getJwtTokenOrThrow, removeJwtToken} from "../utils/authentication";
import ArrowRightOnRectangle from "../icons/ArrowRightOnRectangle";

export function layoutHeaderLoader() {
    return getJwtTokenOrThrow()
}

export function LayoutHeader() {
    const { jwtToken, role, userId } = useLoaderData() as ReturnType<typeof layoutHeaderLoader>
    const isStudent = role === 'STUDENT'

    const navigate = useNavigate()

    const path = useLocation().pathname.split('/').slice(1)
    const breadcrumbs = path.map((p, index) => {
        return {
            title: `${p}`,
            link: `/${path.slice(0, index + 1).join('/')}`,
        }
    })

    const onSignOut = () => {
        removeJwtToken()
        navigate("/signin")
    }

    return (
        <div className='font-montserrat scrollbar min-h-screen bg-gray-100 text-gray-900 py-6 px-4 sm:px-6 lg:px-32'>
            <Toaster/>
            <div className="mx-auto text-lg sm:text-3xl font-bold flex justify-between tracking-wide">
                <NavLink to='/' className={({isActive}) => `flex-shrink-0 flex smooth-transition ${isActive ? 'text-blue-600' : 'text-black hover:text-blue-600 active:text-blue-400'}`}>
                    <img src={LOGO_PNG} className='w-14 h-14 sm:w-20 sm:h-20 mr-3' alt='logo' title='Student Management System'/>
                    Student <br/> Management
                </NavLink>

                <div className='flex flex-col items-end space-y-1'>
                    <NavLink to={isStudent ? `/students/${userId}` : '/students' } className={({isActive}) => `sm:text-lg flex items-start smooth-transition ${isActive ? 'text-blue-500' : 'text-black hover:text-blue-600 active:text-blue-400'}`}>
                        { isStudent ? 'Your Profile' : 'Students' } <ArrowRightIcon className='w-5 mt-1 ml-2'/>
                    </NavLink>
                    <NavLink to='/courses' className={({isActive}) => `sm:text-lg flex items-start smooth-transition ${isActive ? 'text-blue-500' : 'text-black hover:text-blue-600 active:text-blue-400'}`}>
                        Courses <ArrowRightIcon className='w-5 mt-1 ml-2'/>
                    </NavLink>
                    <button onClick={onSignOut} className='sm:text-lg flex items-start hover:text-red-600 active:text-red-400 smooth-transition'>
                        Sign Out <ArrowRightOnRectangle className='w-5 mt-1 ml-2'/>
                    </button>
                </div>
            </div>

            <Breadcrumb breadcrumbs={breadcrumbs}/>
            <Outlet/>
        </div>
    )
}