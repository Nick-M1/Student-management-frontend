import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react'
import getAllStudentsByQuery from "../DB/students/getAllStudentsByQuery";
import getAllSubjects from "../DB/getAllSubjects";
import TablePage from "../components/generic-components/TablePage";
import StudentForm from "../components/forms/StudentForm";
import StudentsAllRowComponent from "../components/row-component/StudentsAllRowComponent";
import deleteStudent from "../DB/students/deleteStudent";
import {tableColumnsStudentsAll} from "../constants/table-columns-students-all";
import getAllCourses from "../DB/courses/getAllCoursesByQuery";
import {useLoaderData} from "react-router-dom";
import usePopupForm from "../hooks/usePopupForm";
import CourseForm from "../components/forms/CourseForm";
import usePagination from "../hooks/usePagination";
import getCountStudentsByQuery from "../DB/students/getCountStudentsByQuery";
import {defaultQueryParams} from "../constants/default-query-params";
import {getJwtTokenOrThrow} from "../utils/authentication";




export async function loader() {
    const { jwtToken, role} = getJwtTokenOrThrow()

    const subjectsLoader = await getAllSubjects(jwtToken)
    const studentsLoader = await getAllStudentsByQuery(jwtToken, defaultQueryParams.asc, defaultQueryParams.orderby, defaultQueryParams.textsearch, defaultQueryParams.pagenumber, subjectsLoader)

    return { jwtToken, role, studentsLoader, subjectsLoader }
}

export function Component() {
    const { jwtToken, role, studentsLoader, subjectsLoader } = useLoaderData() as Awaited<ReturnType<typeof loader>>

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
        getAllStudentsByQuery(jwtToken, sortingAsc, sortingOrderby, sortingTextsearch, pagenumber, selectedOptions)
            .then(students => setStudents(students))
    }, [sortingAsc, sortingOrderby, sortingTextsearch, pagenumber, selectedOptions])

    useEffect(() => {
        if (recentlyUpdatedItem === null)
            return

        getAllSubjects(jwtToken)
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

                    jwtToken={jwtToken}
                />
            }
            setPopupFormOpen={setPopupFormOpen}
            setPopupFormItem={setPopupFormItem}


            displayRowGenerator={StudentsAllRowComponent}
            onDelete={(item: Student) => deleteStudent(jwtToken, item)}

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
