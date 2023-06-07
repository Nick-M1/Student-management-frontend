import {useLoaderData} from "react-router-dom";
import React, {useEffect, useState} from "react";
import getAllSubjects from "../DB/getAllSubjects";
import TablePage from "../components/generic-components/TablePage";
import getStudentById from "../DB/students/getStudentById";
import getMarkingPage from "../DB/markings/getMarkingPage";
import MarkingForm from "../components/forms/MarkingForm";
import MarkingsRowComponent from "../components/row-component/MarkingsRowComponent";
import deleteMarking from "../DB/markings/deleteMarking";
import StudentDetailedHeader from "../components/student/StudentDetailedHeader";
import {tableColumnsStudentDetailed} from "../constants/table-columns-student-detailed";
import usePopupForm from "../hooks/usePopupForm";
import {defaultQueryParams} from "../constants/default-query-params";
import usePagination from "../hooks/usePagination";
import getMarkingStatistics from "../DB/markings/getMarkingStatistics";
import {getJwtTokenOrThrow, isAdminFunc} from "../utils/authentication";

export async function loader({params}: { params: any }) {
    const { studentId } = params
    const { jwtToken, role} = getJwtTokenOrThrow()
    const isAdmin = isAdminFunc(role)

    const studentLoader = await getStudentById(jwtToken, studentId)
    const subjectsLoader = await getAllSubjects(jwtToken)

    const markingsPageLoader = await getMarkingPage(jwtToken, studentId, defaultQueryParams.asc, defaultQueryParams.orderby, defaultQueryParams.textsearch, defaultQueryParams.pagenumber)
    const markingStatisticsLoader = await getMarkingStatistics(jwtToken, studentId)

    return { jwtToken, isAdmin, studentLoader, subjectsLoader, markingsPageLoader, markingStatisticsLoader }
}


export function Component() {
    const { jwtToken, isAdmin, studentLoader, subjectsLoader, markingsPageLoader, markingStatisticsLoader } = useLoaderData() as Awaited<ReturnType<typeof loader>>



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
        getMarkingPage(jwtToken, studentLoader.id, sortingAsc, sortingOrderby, sortingTextsearch, pagenumber)
            .then(markingsResponse => setAllMarkings(markingsResponse))
    }, [sortingAsc, sortingOrderby, sortingTextsearch, pagenumber, selectedOptions])

    useEffect(() => {
        getMarkingStatistics(jwtToken, studentLoader.id)
            .then(stats => setMarkingStatistics(stats))
    }, [recentlyUpdatedItem])

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
        <div>
            <StudentDetailedHeader
                student={studentLoader}
                means={markingStatistics}
                jwtToken={jwtToken}
                isAdmin={isAdmin}
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

                        jwtToken={jwtToken}
                        studentId={studentLoader.id}
                    />
                }
                setPopupFormOpen={setPopupFormOpen}
                setPopupFormItem={setPopupFormItem}

                displayRowGenerator={MarkingsRowComponent}
                onDelete={(item: Marking) => deleteMarking(jwtToken, item.id)}

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
        </div>
    )
}