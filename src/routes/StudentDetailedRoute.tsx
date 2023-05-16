import {Link, useLoaderData, useNavigate} from "react-router-dom";
import ColoredListDisplay from "../components/student/ColoredListDisplay";
import SortUpIcon from "../icons/SortUpIcon";
import SortDownIcon from "../icons/SortDownIcon";
import PopupStudentForm from "../components/forms/PopupStudentForm";
import {useState} from "react";
import PopupLargeCustom from "../components/shared/PopupLargeCustom";
import MarkingForm from "../components/forms/MarkingForm";
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import PopupSmallCustom from "../components/shared/PopupSmallCustom";

export async function loader({params}: { params: any }) {
    const { studentId } = params

    const student: Student = await fetch(`http://localhost:8080/api/v1/student/${studentId}`).then(r => r.json())
    const markingsResponse: MarkingResponse = await fetch(`http://localhost:8080/api/v1/marking/${studentId}/statistics`).then(r => r.json())

    return { student, markingsResponse }
}

const columns: StudentColumn[] = [
    {
        header: "Mark id",
        accessor: "id",
    },
    {
        header: "Subject",
        accessor: "subject",
    },
    {
        header: "Score",
        accessor: "score",
    },
]

async function deleteMarking(markingId: number) {
    return await fetch(
        `http://localhost:8080/api/v1/marking/${markingId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
}

enum PopupEnum {
    NONE, EDIT_STUDENT, EDIT_MARK, DELETE_MARK
}

export function Component() {
    const { student, markingsResponse } = useLoaderData() as Awaited<ReturnType<typeof loader>>
    const { markings, mean } = markingsResponse

    const navigate = useNavigate()


    const [selectedMarking, setSelectedMarking] = useState<Marking | null>(null)

    const [popupStudentFormOpen, setPopupStudentFormOpen] = useState<PopupEnum>(PopupEnum.NONE)
    const openPopupNewStudent = () => setPopupStudentFormOpen(PopupEnum.EDIT_STUDENT)
    const openPopupNewMark = () => setPopupStudentFormOpen(PopupEnum.EDIT_MARK)
    const openPopupDeleteMark = () => setPopupStudentFormOpen(PopupEnum.DELETE_MARK)

    const closePopup = () => {
        setPopupStudentFormOpen(PopupEnum.NONE)
        setSelectedMarking(null)
    }

    async function handleMarkDelete(markingId: number) {
        const response = await deleteMarking(markingId)

        if (response.ok)
            navigate(0)
    }

    return (
        <>
            <div className='flex pt-3 items-center'>
                <img src={student.image} alt={student.name} title={student.name} className='h-[20dvh] rounded-full shadow-xl'/>
                <div className='pl-4'>
                    <h3 className='text-xl font-semibold mb-2'>{ student.name }</h3>
                    <h4 className='italic'>Email: { student.email }</h4>
                    <h4 className='italic'>DOB: { student.dob } </h4>
                    <h4 className='italic text-gray-500'>Age: { student.age } </h4>
                </div>
                <button onClick={openPopupNewStudent} className='btn-primary ml-auto'>Update Student</button>
            </div>

            <div className='py-4 flex justify-between'>
                <div className='w-fit rounded-lg flex space-x-4 items-center py-2 px-4 bg-neutral-500/5 border border-neutral-300'>
                    <h3 className=''>Subjects:</h3>
                    <ColoredListDisplay items={student.subjects}/>
                </div>
                <button onClick={openPopupNewMark} className='btn-secondary'>Add New Mark</button>
            </div>

            <div className='pt-2 pb-4'>
                {/* todo: group scores by subject & find min, max, avg of each */}
                Average scores by subject:
                <ul className='text-gray-500 list-disc list-inside capitalize'>
                    { Object.entries(mean).map(([subject, subjectMean]) =>
                        <li key={subject}>
                            { subject } - <span className='italic'>{ subjectMean.toFixed(3) }</span>
                        </li>
                    )}
                </ul>
            </div>

            <div>
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        { columns.map( (column) => (
                            <th scope="col" className="px-6 py-3" key={column.header}>
                                <div
                                    className="flex items-center cursor-pointer"
                                    // onClick={() => {
                                    //     if (column.accessor == sortingOrderby)
                                    //         setSortingAsc(asc => !asc)
                                    //     else {
                                    //         setSortingOrderby(column.accessor)
                                    //         setSortingAsc(true)
                                    //     }
                                    // }}
                                >
                                    { column.header }

                                    {/*<div className='ml-2'>*/}
                                    {/*    <SortUpIcon className={`w-3.5 h-3.5 -mb-3 ${column.accessor == sortingOrderby && !sortingAsc && 'opacity-0' }`}/>*/}
                                    {/*    <SortDownIcon className={`w-3.5 h-3.5 ${column.accessor == sortingOrderby && sortingAsc && 'opacity-0' }`}/>*/}
                                    {/*</div>*/}
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
                    { markings.map( (mark) => (
                        <tr key={mark.id} className={`group border-b smooth-transition ${ false ? 'bg-cyan-50' : 'bg-white hover:bg-gray-50'}`} >


                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {mark.id}
                            </th>

                            {/*<td>*/}
                            {/*    /!*<Link to={`student/${student.id}`} className="flex px-6 py-4 items-center">*!/*/}
                            {/*        <img src={student.image} alt='student profile' className='w-10 h-10 rounded-full shadow-sm mr-3' />*/}
                            {/*        {student.name}*/}
                            {/*    /!*</Link>*!/*/}
                            {/*</td>*/}

                            <td className="px-6 py-4 capitalize">
                                {mark.subject}
                            </td>
                            <td className="px-6 py-4">
                                {mark.score}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button
                                    type='button'
                                    className="font-medium text-blue-500 dark:text-blue-500 hover:text-blue-700 smooth-transition"
                                    onClick={() => {
                                        setSelectedMarking(mark)
                                        openPopupNewMark()
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
                                        setSelectedMarking(mark)
                                        openPopupDeleteMark()
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

            <PopupStudentForm
                open={popupStudentFormOpen === PopupEnum.EDIT_STUDENT}
                setClose={closePopup}

                setRecentlyUpdatedStudent={null}

                studentToEdit={student}
                setPopupStudentFormStudent={null}
            />

            <PopupLargeCustom open={popupStudentFormOpen === PopupEnum.EDIT_MARK} setOpen={closePopup} title='Add New Mark'>
                <MarkingForm studentId={student.id} defaultMarking={selectedMarking}/>
            </PopupLargeCustom>

            <PopupSmallCustom
                modal={popupStudentFormOpen === PopupEnum.DELETE_MARK}
                setModal={openPopupDeleteMark}
                confirmHandler={() => handleMarkDelete(selectedMarking?.id || -1)}
                titleText={'Delete this marking'}
                descriptionText={'Are you sure you want to delete this marking? 😥'}
                buttonText={'Delete'}
                IconImg={ExclamationTriangleIcon}
            />
        </>
    )
}