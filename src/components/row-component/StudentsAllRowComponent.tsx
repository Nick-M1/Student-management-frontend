import {Link} from "react-router-dom";
import ColoredListDisplay from "../shared/ColoredListDisplay";

export default function StudentsAllRowComponent(item: Student) {
    return (
        <>
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {item.id}
            </th>
            <td>
                <Link to={`/students/${item.id}`} className="flex px-6 py-4 items-center">
                    <img src={item.image} alt='student profile' className='w-10 h-10 rounded-full shadow-sm mr-3' />
                    {item.name}
                </Link>
            </td>
            <td className="px-6 py-4">
                {item.email}
            </td>
            <td className="px-6 py-4">
                {item.dob}
            </td>
            <td className="px-6 py-4">
                <ColoredListDisplay items={item.subjects}/>
            </td>
        </>
    )
}