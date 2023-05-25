import {Link} from "react-router-dom";

export function Component() {
    return (
        <div className='flex justify-center'>
            <Link to='/students' className='btn-primary mt-10'>TO STUDENTS TABLE</Link>
        </div>
    )
}