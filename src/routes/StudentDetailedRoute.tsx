import {useLoaderData} from "react-router-dom";
import React, {useEffect, useState} from "react";
import getAllSubjects from "../DB/getAllSubjects";
import TablePage from "../components/generic-components/TablePage";
import {tableColumnsCourses} from "../constants/table-columns-courses";
import CourseForm from "../components/forms/CourseForm";
import CoursesRowComponent from "../components/row-component/CoursesRowComponent";
import deleteCourse from "../DB/deleteCourse";
import getStudentById from "../DB/getStudentById";
import getMarking from "../DB/getMarking";
import MarkingForm from "../components/forms/MarkingForm";
import MarkingsRowComponent from "../components/row-component/MarkingsRowComponent";
import deleteMarking from "../DB/deleteMarking";
import StudentDetailedHeader from "../components/student/StudentDetailedHeader";
import {tableColumnsStudentDetailed} from "../constants/table-columns-student-detailed";
import usePopupForm from "../hooks/usePopupForm";

export async function loader({params}: { params: any }) {
    const { studentId } = params

    const studentLoader = await getStudentById(studentId)
        .then(r => {
            if (r === null)
                throw new Error(`Student not found with id ${studentId}`)

            return r
    })

    const subjectsLoader = await getAllSubjects()
    const markingsResponseLoader = await getMarking(studentId)

    return { studentLoader, subjectsLoader, markingsResponseLoader }
}


export function Component() {
    const { studentLoader, subjectsLoader, markingsResponseLoader } = useLoaderData() as Awaited<ReturnType<typeof loader>>

    // From DB
    const [allMarkings, setAllMarkings] = useState(markingsResponseLoader.markings)
    const [allSubjects, setAllSubjects] = useState(subjectsLoader)

    // Querying for DB
    const [sortingAsc, setSortingAsc] = useState(true)
    const [sortingOrderby, setSortingOrderby] = useState('id')
    const [sortingTextsearch, setSortingTextsearch] = useState('')
    const [selectedSubjects, setSelectedSubjects] = useState([] as string[])

    // For updates from client to db
    const [recentlyUpdatedItem, setRecentlyUpdatedItem] = useState<number | null>(null)

    // Popup for DB edit
    const [
        popupFormOpen,
        setPopupFormOpen,
        popupFormItem,
        setPopupFormItem,
        closePopupForm
    ] = usePopupForm<Marking>()



    useEffect(() => {
        getMarking(studentLoader.id)
            .then(markingsResponse => setAllMarkings(markingsResponse.markings))

    }, [sortingAsc, sortingOrderby, sortingTextsearch, selectedSubjects])

    useEffect(() => {
        if (recentlyUpdatedItem === null)
            return

        getAllSubjects()
            .then(subjects => {
                setAllSubjects(subjects)
                setSelectedSubjects(subjects)
            })

        setTimeout(() => setRecentlyUpdatedItem(null), 400)
    }, [recentlyUpdatedItem])

    return (
        <div>
            <StudentDetailedHeader
                student={studentLoader}
                means={markingsResponseLoader.mean}
            />

            <TablePage
                itemName='marking'
                columns={tableColumnsStudentDetailed}
                data={allMarkings}
                filterPossibleOptions={allSubjects}

                recentlyUpdatedItem={recentlyUpdatedItem}
                setRecentlyUpdatedItem={setRecentlyUpdatedItem}

                PopupForm={
                    <MarkingForm
                        open={popupFormOpen}
                        setClose={closePopupForm}
                        itemName='marking'
                        itemToEdit={popupFormItem}
                        setItemToEdit={setPopupFormItem}
                        setRecentlyUpdatedItem={setRecentlyUpdatedItem}
                        studentId={studentLoader.id}
                    />
                }
                setPopupFormOpen={setPopupFormOpen}
                setPopupFormItem={setPopupFormItem}

                displayRowGenerator={MarkingsRowComponent}
                onDelete={(item: Marking) => deleteMarking(item.id)}

                sortingAsc={sortingAsc}
                setSortingAsc={setSortingAsc}
                sortingOrderby={sortingOrderby}
                setSortingOrderby={setSortingOrderby}
                sortingTextsearch={sortingTextsearch}
                setSortingTextsearch={setSortingTextsearch}
                selectedFilterOptions={selectedSubjects}
                setSelectedFilterOptions={setSelectedSubjects}
            />
        </div>
    )
}