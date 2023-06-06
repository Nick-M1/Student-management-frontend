import {useLoaderData} from "react-router-dom";
import React, {useEffect, useState} from "react";
import getAllSubjects from "../DB/getAllSubjects";
import TablePage from "../components/generic-components/TablePage";
import {tableColumnsCourses} from "../constants/table-columns-courses";
import CourseForm from "../components/forms/CourseForm";
import CoursesRowComponent from "../components/row-component/CoursesRowComponent";
import deleteCourse from "../DB/deleteCourse";
import getStudentById from "../DB/getStudentById";
import getMarkingPage from "../DB/getMarkingPage";
import MarkingForm from "../components/forms/MarkingForm";
import MarkingsRowComponent from "../components/row-component/MarkingsRowComponent";
import deleteMarking from "../DB/deleteMarking";
import StudentDetailedHeader from "../components/student/StudentDetailedHeader";
import {tableColumnsStudentDetailed} from "../constants/table-columns-student-detailed";
import usePopupForm from "../hooks/usePopupForm";
import {defaultQueryParams} from "../constants/default-query-params";
import usePagination from "../hooks/usePagination";
import getMarkingStatistics from "../DB/getMarkingStatistics";

export async function loader({params}: { params: any }) {
    const { studentId } = params

    const studentLoader = await getStudentById(studentId)
    const subjectsLoader = await getAllSubjects()

    const markingsPageLoader = await getMarkingPage(studentId, defaultQueryParams.asc, defaultQueryParams.orderby, defaultQueryParams.textsearch, defaultQueryParams.pagenumber)
    const markingStatisticsLoader = await getMarkingStatistics(studentId)

    return { studentLoader, subjectsLoader, markingsPageLoader, markingStatisticsLoader }
}


export function Component() {
    const { studentLoader, subjectsLoader, markingsPageLoader, markingStatisticsLoader } = useLoaderData() as Awaited<ReturnType<typeof loader>>

    // From DB
    const [allMarkings, setAllMarkings] = useState(markingsPageLoader)
    const [markingStatistics, setMarkingStatistics] = useState(markingStatisticsLoader)
    const [allSubjects, setAllSubjects] = useState(subjectsLoader)

    // Querying for DB
    const [sortingAsc, setSortingAsc] = useState(true)
    const [sortingOrderby, setSortingOrderby] = useState('id')
    const [sortingTextsearch, setSortingTextsearch] = useState('')
    const [selectedOptions, setSelectedOptions] = useState([] as string[])

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
    ] = usePopupForm<Marking>()



    useEffect(() => {
        getMarkingPage(studentLoader.id, sortingAsc, sortingOrderby, sortingTextsearch, pagenumber)
            .then(markingsResponse => setAllMarkings(markingsResponse))
    }, [sortingAsc, sortingOrderby, sortingTextsearch, pagenumber, selectedOptions])

    useEffect(() => {
        getMarkingStatistics(studentLoader.id)
            .then(stats => setMarkingStatistics(stats))
    }, [recentlyUpdatedItem])

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
        <div>
            <StudentDetailedHeader
                student={studentLoader}
                means={markingStatistics}
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
                selectedFilterOptions={selectedOptions}
                setSelectedFilterOptions={setSelectedOptions}

                nextPageNavigate={nextPageNavigate}
                previousPageNavigate={previousPageNavigate}
            />
        </div>
    )
}