import {Dispatch, SetStateAction, useState} from "react";
import PopupSmallCustom from "./shared/PopupSmallCustom";
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import {toastOptionsCustom} from "../utils/toast-options-custom";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/24/solid";
import subjectToColour from "../utils/subject-to-colour";
import {capitalise} from "../utils/textUtils";
import {Link} from "react-router-dom";
import ColoredListDisplay from "./student/ColoredListDisplay";
import SortUpIcon from "../icons/SortUpIcon";
import SortDownIcon from "../icons/SortDownIcon";




type Props = {
    columns: StudentColumn[]
    students: Student[]

    recentlyUpdatedStudent: number | null
    setPopupStudentFormOpen: Dispatch<SetStateAction<boolean>>
    setPopupStudentFormStudent: Dispatch<SetStateAction<Student | null>>
    setRecentlyUpdatedStudent: Dispatch<SetStateAction<number | null>>

    // QUERYING
    sortingAsc: boolean
    setSortingAsc: Dispatch<SetStateAction<boolean>>
    sortingOrderby: string
    setSortingOrderby: Dispatch<SetStateAction<string>>
}

export default function Table({ columns, students, recentlyUpdatedStudent, setPopupStudentFormOpen, setPopupStudentFormStudent, setRecentlyUpdatedStudent, sortingAsc, setSortingAsc, sortingOrderby, setSortingOrderby }: Props) {
    const [deletePopupOpen, setDeletePopupOpen] = useState(false)
    const [deletePopupStudent, setDeletePopupStudent] = useState<Student | null>(null)

    const handleStudentDelete = async () => {
        toast.loading('Deleting student from database...', { ...toastOptionsCustom, id: 'delete student' } )

        if (deletePopupStudent == null) {
            toast.error('Delete failed', { id: 'delete student' })
            return
        }

        const response = await fetch(
            `http://localhost:8080/api/v1/student/${deletePopupStudent.id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        const responseJson = await response.json()

        if (!response.ok) {
            console.log(responseJson)
            toast.error('Delete failed', { id: 'delete student' })
            return
        }

        toast.success('Deleted student successfully', { id: 'delete student' })
        setRecentlyUpdatedStudent(deletePopupStudent.id)
        setDeletePopupStudent(null)
    }

    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            { columns.map( (column) => (
                                <th scope="col" className="px-6 py-3" key={column.header}>
                                    <div
                                        className="flex items-center cursor-pointer"
                                        onClick={() => {
                                            if (column.accessor == sortingOrderby)
                                                setSortingAsc(asc => !asc)
                                            else {
                                                setSortingOrderby(column.accessor)
                                                setSortingAsc(true)
                                            }
                                        }}
                                    >
                                        { column.header }

                                        <div className='ml-2'>
                                            <SortUpIcon className={`w-3.5 h-3.5 -mb-3 ${column.accessor == sortingOrderby && !sortingAsc && 'opacity-0' }`}/>
                                            <SortDownIcon className={`w-3.5 h-3.5 ${column.accessor == sortingOrderby && sortingAsc && 'opacity-0' }`}/>
                                        </div>
                                    </div>
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Delete</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        { students.map( (student) => (
                            <tr key={student.id} className={`group border-b smooth-transition ${recentlyUpdatedStudent == student.id ? 'bg-cyan-50' : 'bg-white hover:bg-gray-50'}`} >


                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {student.id}
                                </th>

                                <td>
                                    <Link to={`student/${student.id}`} className="flex px-6 py-4 items-center">
                                        <img src={student.image} alt='student profile' className='w-10 h-10 rounded-full shadow-sm mr-3' />
                                        {student.name}
                                    </Link>
                                </td>

                                <td className="px-6 py-4">
                                    {student.email}
                                </td>
                                <td className="px-6 py-4">
                                    {student.dob}
                                </td>
                                <td className="px-6 py-4">
                                    <ColoredListDisplay items={student.subjects}/>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        type='button'
                                        className="font-medium text-blue-500 dark:text-blue-500 hover:text-blue-700 smooth-transition"
                                        onClick={() => {
                                            setPopupStudentFormStudent(student)
                                            setPopupStudentFormOpen(true)
                                        }}
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        type='button'
                                        className="font-medium text-red-500 dark:text-blue-400 hover:text-red-700 smooth-transition"
                                        onClick={() => {
                                            setDeletePopupStudent(student)
                                            setDeletePopupOpen(true)
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <PopupSmallCustom
                modal={deletePopupOpen}
                setModal={setDeletePopupOpen}
                confirmHandler={handleStudentDelete}
                titleText={'Delete this student'}
                descriptionText={'Are you sure you want to delete this student? 😥'}
                buttonText={'Delete'}
                IconImg={ExclamationTriangleIcon}
            />
        </>
    );
};