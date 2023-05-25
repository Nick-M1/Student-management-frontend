import {Link} from "react-router-dom";
import HomeIcon from "../../icons/HomeIcon";
import {Fragment} from "react";
import ChevronIcon from "../../icons/ChevronIcon";

type Props = {
    breadcrumbs: {
        title: string,
        link: string
    }[]
}

export default function Breadcrumb({ breadcrumbs }: Props) {
    // if at home page -> no breadcrumbs
    if (breadcrumbs[0].title === '')
        return <></>

    return (
        <div className='flex space-x-3 text-sm font-semibold text-gray-500/70 mt-3 mb-5'>
            <Link to='/'><HomeIcon className='w-5 opacity-70 hover:text-gray-600 active:text-gray-800 smooth-transition'/></Link>

            { breadcrumbs.map(({ title, link }) =>
                <Fragment key={title}>
                    <ChevronIcon className='w-5 opacity-50'/>
                    <Link to={link} className='capitalize hover:text-gray-600 active:text-gray-800 smooth-transition'>{ title }</Link>
                </Fragment>
            )}
        </div>
    )
}