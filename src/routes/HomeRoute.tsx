import {HOMEPAGE_GIF} from "../constants/assets-constants";

export function Component() {
    return (
        <div>
            <img src={HOMEPAGE_GIF} alt='Homepage' title='Student Management System' className='mx-auto pt-5 max-w-xs md:max-w-sm'/>

            <div className='text-center bg-neutral-200 p-5 rounded-lg md:mx-10 mt-5 font-bold text-xl'>
                CRUD app to manage students, courses and student's grades for each course.
                <br/>
                <span className='font-medium italic'>Built using Java Spring & React.</span>
            </div>
        </div>
    )
}