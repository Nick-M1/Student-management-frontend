import {useLoaderData} from "react-router-dom";
import React, {useEffect, useState} from "react";
import TablePage from "../components/generic-components/TablePage";
import getAllCourses from "../DB/courses/getAllCoursesByQuery";
import deleteCourse from "../DB/courses/deleteCourse";
import CoursesRowComponent from "../components/row-component/CoursesRowComponent";
import CourseForm from "../components/forms/CourseForm";
import {tableColumnsCourses} from "../constants/table-columns-courses";
import usePopupForm from "../hooks/usePopupForm";
import {defaultQueryParams} from "../constants/default-query-params";
import usePagination from "../hooks/usePagination";
import getAllDepartments from "../DB/getAllDepartments";
import getAllCoursesByQuery from "../DB/courses/getAllCoursesByQuery";
import {getJwtTokenOrThrow, isAdminFunc} from "../utils/authentication";

export async function loader() {
    const { jwtToken, role} = getJwtTokenOrThrow()
    const isAdmin = isAdminFunc(role)

    const departmentsLoader = await getAllDepartments(jwtToken)
    const coursesLoader = await getAllCoursesByQuery(jwtToken, defaultQueryParams.asc, defaultQueryParams.orderby, defaultQueryParams.textsearch, defaultQueryParams.pagenumber, departmentsLoader)

    return { jwtToken, isAdmin, departmentsLoader, coursesLoader }
}


export function Component() {
    const { jwtToken, isAdmin, departmentsLoader, coursesLoader } = useLoaderData() as Awaited<ReturnType<typeof loader>>


    // From DB
    const [allCourses, setAllCourses] = useState(coursesLoader)
    const [allDepartments, setAllDepartments] = useState(departmentsLoader)

    // Querying for DB
    const [sortingAsc, setSortingAsc] = useState(defaultQueryParams.asc)
    const [sortingOrderby, setSortingOrderby] = useState(defaultQueryParams.orderby)
    const [sortingTextsearch, setSortingTextsearch] = useState(defaultQueryParams.textsearch)
    const [selectedOptions, setSelectedOptions] = useState(departmentsLoader)

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
    ] = usePopupForm<Course>()

    useEffect(() => {
        getAllCourses(jwtToken, sortingAsc, sortingOrderby, sortingTextsearch, pagenumber, selectedOptions)
            .then(courses => setAllCourses(courses))
    }, [sortingAsc, sortingOrderby, sortingTextsearch, pagenumber, selectedOptions])

    useEffect(() => {
        if (recentlyUpdatedItem === null)
            return

        getAllDepartments(jwtToken)
            .then(departments => {
                setAllDepartments(departments)
                setSelectedOptions(departments)
            })

        setTimeout(() => setRecentlyUpdatedItem(null), 400)
    }, [recentlyUpdatedItem])

    return (
        <TablePage
            itemName='courses'
            columns={tableColumnsCourses}
            data={allCourses}
            filterPossibleOptions={allDepartments}

            recentlyUpdatedItem={recentlyUpdatedItem}
            setRecentlyUpdatedItem={setRecentlyUpdatedItem}

            PopupForm={
                <CourseForm
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

            displayRowGenerator={CoursesRowComponent}
            onDelete={(item: Course) => deleteCourse(jwtToken, item)}

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

            isAdmin={isAdmin}
        />
    )
}