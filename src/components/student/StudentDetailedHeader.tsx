import StudentForm from "../forms/StudentForm";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import ColoredListDisplay from "../shared/ColoredListDisplay";

type Props = {
    student: Student
    means: MarkingStatistics
}

export default function StudentDetailedHeader({ student, means }: Props) {
    const [studentFormPopup, setStudentFormPopup] = useState(false)
    const closeStudentFormPopup = () => setStudentFormPopup(false)
    const openStudentFormPopup = () => setStudentFormPopup(true)

    const navigate = useNavigate()

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
                <button onClick={openStudentFormPopup} className='btn-primary ml-auto'>Update Student</button>
            </div>

            <div className='py-4 flex justify-between'>
                <div className='w-fit rounded-lg flex space-x-4 items-center py-2 px-4 bg-neutral-500/5 border border-neutral-300'>
                    <h3 className=''>Subjects:</h3>
                    <ColoredListDisplay items={student.subjects}/>
                </div>
                {/*<button onClick={openPopupNewMark} className='btn-secondary'>Add New Mark</button>*/}
            </div>

            <div className='pt-2'>
                Average scores by module:
                <ul className='text-gray-500 list-disc list-inside capitalize'>
                    { means.map(([courseCode, courseAverage]) =>
                        <li key={courseCode}>
                            { courseCode } - <span className='italic'>{ courseAverage.toFixed(3) }</span>
                        </li>
                    )}
                </ul>
            </div>

            <hr className='border border-gray-200 my-6'/>

            <StudentForm
                open={studentFormPopup}
                setClose={closeStudentFormPopup}
                itemName='student'
                itemToEdit={student}
                setItemToEdit={() => {}}
                setRecentlyUpdatedItem={() => { navigate(0) }}
            />
        </>
    )
}