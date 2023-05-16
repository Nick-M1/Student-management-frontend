import Table from "./Table";
import {Dispatch, SetStateAction, useState} from "react";
import PopupStudentForm from "./forms/PopupStudentForm";
import Searchbar from "./shared/Searchbar";
import SubjectSelector from "./filters/SubjectSelector";

type Props = {
    columns: StudentColumn[]
    students: Student[]
    allSubjects: string[]

    recentlyUpdatedStudent: number | null
    setRecentlyUpdatedStudent: Dispatch<SetStateAction<number | null>>

    // QUERYING
    sortingAsc: boolean
    setSortingAsc: Dispatch<SetStateAction<boolean>>
    sortingOrderby: string
    setSortingOrderby: Dispatch<SetStateAction<string>>
    sortingTextsearch: string
    setSortingTextsearch: Dispatch<SetStateAction<string>>
    selectedSubjects: string[]
    setSelectedSubjects: Dispatch<SetStateAction<string[]>>
}

export default function MainPage({ columns, students, allSubjects, recentlyUpdatedStudent, setRecentlyUpdatedStudent, sortingAsc, setSortingAsc, sortingOrderby, setSortingOrderby, sortingTextsearch, setSortingTextsearch, selectedSubjects, setSelectedSubjects }: Props) {
    const [popupStudentFormOpen, setPopupStudentFormOpen] = useState(false)
    const [popupStudentFormStudent, setPopupStudentFormStudent] = useState<Student | null>(null)

    return (
        <>
            <main className="mx-auto">
                <div className='grid grid-cols-4'>
                    <div className='col-span-3'>
                        <Searchbar sortingTextsearch={sortingTextsearch} setSortingTextsearch={setSortingTextsearch}/>
                    </div>
                    <div className='col-start-5'>
                        <button
                            type='button'
                            onClick={() => {
                                setPopupStudentFormStudent(null)
                                setPopupStudentFormOpen(true)
                            }}
                            className='btn-primary'
                        >
                            Add new student
                        </button>
                    </div>
                </div>

                <div className='mt-7 block leading-6 text-gray-700 mb-3'>
                    <p className='mb-1'>Filter by subjects</p>
                    <SubjectSelector allPossibleLabels={allSubjects} selectedLabels={selectedSubjects} setSelectedLabels={setSelectedSubjects} />
                </div>

                <div className="mt-6">
                    <Table
                        columns={columns}
                        students={students}
                        recentlyUpdatedStudent={recentlyUpdatedStudent}
                        setPopupStudentFormOpen={setPopupStudentFormOpen}
                        setPopupStudentFormStudent={setPopupStudentFormStudent}
                        setRecentlyUpdatedStudent={setRecentlyUpdatedStudent}

                        sortingAsc={sortingAsc}
                        setSortingAsc={setSortingAsc}
                        sortingOrderby={sortingOrderby}
                        setSortingOrderby={setSortingOrderby}
                    />
                </div>
            </main>

            <PopupStudentForm
                open={popupStudentFormOpen}
                setClose={() => setPopupStudentFormOpen(false)}

                setRecentlyUpdatedStudent={setRecentlyUpdatedStudent}

                studentToEdit={popupStudentFormStudent}
                setPopupStudentFormStudent={setPopupStudentFormStudent}
            />
        </>
    );
}