import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react'
import getAllStudentsByQuery from "../DB/getAllStudentsByQuery";
import getAllSubjects from "../DB/getAllSubjects";
import TablePage from "../components/generic-components/TablePage";
import StudentForm from "../components/forms/StudentForm";
import StudentsAllRowComponent from "../components/row-component/StudentsAllRowComponent";
import deleteStudent from "../DB/deleteStudent";
import {tableColumnsStudentsAll} from "../constants/table-columns-students-all";
import getAllCourses from "../DB/getAllCoursesByQuery";
import {useLoaderData} from "react-router-dom";
import usePopupForm from "../hooks/usePopupForm";
import CourseForm from "../components/forms/CourseForm";
import usePagination from "../hooks/usePagination";
import getCountStudentsByQuery from "../DB/getCountStudentsByQuery";
import {defaultQueryParams} from "../constants/default-query-params";




export async function loader() {
    const subjectsLoader = await getAllSubjects()
    const studentsLoader = await getAllStudentsByQuery(defaultQueryParams.asc, defaultQueryParams.orderby, defaultQueryParams.textsearch, defaultQueryParams.pagenumber, subjectsLoader)

    return { studentsLoader, subjectsLoader }
}

export function Component() {
    const { studentsLoader, subjectsLoader } = useLoaderData() as Awaited<ReturnType<typeof loader>>

    // From DB
    const [students, setStudents] = useState(studentsLoader)
    const [allSubjects, setAllSubjects] = useState(subjectsLoader)

    // Querying for DB
    const [sortingAsc, setSortingAsc] = useState(defaultQueryParams.asc)
    const [sortingOrderby, setSortingOrderby] = useState(defaultQueryParams.orderby)
    const [sortingTextsearch, setSortingTextsearch] = useState(defaultQueryParams.textsearch)
    const [selectedOptions, setSelectedOptions] = useState(subjectsLoader)

    const [pagenumber, nextPageNavigate, previousPageNavigate] = usePagination()

    // For updates from client to db
    const [recentlyUpdatedItem, setRecentlyUpdatedItem] = useState<number | null>(null)

    // Popup for DB edit
    const [
        popupFormOpen,
        setPopupFormOpen,
        popupFormItem,
        setPopupFormItem,
        closePopupForm
    ] = usePopupForm<Student>()


    useEffect(() => {
        getAllStudentsByQuery(sortingAsc, sortingOrderby, sortingTextsearch, pagenumber, selectedOptions)
            .then(students => setStudents(students))
    }, [sortingAsc, sortingOrderby, sortingTextsearch, pagenumber, selectedOptions])

    useEffect(() => {
        if (recentlyUpdatedItem === null)
            return

        getAllSubjects()
            .then(subjects => {
                setAllSubjects(subjects)
                setSelectedOptions(subjects)
            })

        setTimeout(() => setRecentlyUpdatedItem(null), 400)

    }, [recentlyUpdatedItem])




    return (
        <TablePage
            itemName='student'
            columns={tableColumnsStudentsAll}
            data={students}
            filterPossibleOptions={allSubjects}

            recentlyUpdatedItem={recentlyUpdatedItem}
            setRecentlyUpdatedItem={setRecentlyUpdatedItem}

            PopupForm={
                <StudentForm
                    open={popupFormOpen}
                    setClose={closePopupForm}
                    itemName='courses'
                    itemToEdit={popupFormItem}
                    setItemToEdit={setPopupFormItem}
                    setRecentlyUpdatedItem={setRecentlyUpdatedItem}
                />
            }
            setPopupFormOpen={setPopupFormOpen}
            setPopupFormItem={setPopupFormItem}


            displayRowGenerator={StudentsAllRowComponent}
            onDelete={(item: Student) => deleteStudent(item)}

            sortingAsc={sortingAsc}
            setSortingAsc={setSortingAsc}
            sortingOrderby={sortingOrderby}
            setSortingOrderby={setSortingOrderby}
            sortingTextsearch={sortingTextsearch}
            setSortingTextsearch={setSortingTextsearch}
            selectedFilterOptions={selectedOptions}
            setSelectedFilterOptions={setSelectedOptions}

            nextPageNavigate={nextPageNavigate}
            previousPageNavigate={previousPageNavigate}
        />
    )
}
