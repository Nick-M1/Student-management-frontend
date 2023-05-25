import {useLoaderData} from "react-router-dom";
import React, {useEffect, useState} from "react";
import getAllSubjects from "../DB/getAllSubjects";
import TablePage from "../components/generic-components/TablePage";
import getAllCourses from "../DB/getAllCourses";
import deleteCourse from "../DB/deleteCourse";
import CoursesRowComponent from "../components/row-component/CoursesRowComponent";
import CourseForm from "../components/forms/CourseForm";
import {tableColumnsCourses} from "../constants/table-columns-courses";
import usePopupForm from "../hooks/usePopupForm";

export async function loader() {
    const subjectsLoader = await getAllSubjects()
    const coursesLoader = await getAllCourses()

    return { subjectsLoader, coursesLoader }
}


export function Component() {
    const { subjectsLoader, coursesLoader } = useLoaderData() as Awaited<ReturnType<typeof loader>>

    // From DB
    const [allCourses, setAllCourses] = useState(coursesLoader)
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
    ] = usePopupForm<Course>()

    useEffect(() => {
        getAllCourses()
            .then(students => setAllCourses(students))

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
        <TablePage
            itemName='courses'
            columns={tableColumnsCourses}
            data={allCourses}
            filterPossibleOptions={allSubjects}

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
                />
            }
            setPopupFormOpen={setPopupFormOpen}
            setPopupFormItem={setPopupFormItem}

            displayRowGenerator={CoursesRowComponent}
            onDelete={(item: Course) => deleteCourse(item)}

            sortingAsc={sortingAsc}
            setSortingAsc={setSortingAsc}
            sortingOrderby={sortingOrderby}
            setSortingOrderby={setSortingOrderby}
            sortingTextsearch={sortingTextsearch}
            setSortingTextsearch={setSortingTextsearch}
            selectedFilterOptions={selectedSubjects}
            setSelectedFilterOptions={setSelectedSubjects}
        />
    )
}