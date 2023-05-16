import React, { useEffect, useState} from 'react'
import getAllStudents from "../DB/getAllStudents";
import MainPage from "../components/MainPage";
import getAllSubjects from "../DB/getAllSubjects";


const columns: StudentColumn[] = [
    {
        header: "Student id",
        accessor: "id",
    },
    {
        header: "Name",
        accessor: "name",
    },
    {
        header: "Email",
        accessor: "email",
    },
    {
        header: "DOB (age)",
        accessor: "dob",
    },
    {
        header: "Subjects",
        accessor: "subject",
    },
]


export function Component() {
    // From DB
    const [students, setStudents] = useState([] as Student[])
    const [allSubjects, setAllSubjects] = useState([] as string[])

    // Querying for DB
    const [sortingAsc, setSortingAsc] = useState(true)
    const [sortingOrderby, setSortingOrderby] = useState('id')
    const [sortingTextsearch, setSortingTextsearch] = useState('')
    const [selectedSubjects, setSelectedSubjects] = useState([] as string[])

    // For updates from client to db
    const [recentlyUpdatedStudent, setRecentlyUpdatedStudent] = useState<number | null>(null)

    useEffect(() => getAllSubjects(setAllSubjects), [recentlyUpdatedStudent])
    useEffect(() => setSelectedSubjects(allSubjects), [allSubjects])

    useEffect(() => {
        getAllStudents(setStudents, sortingAsc, sortingOrderby, sortingTextsearch, selectedSubjects)
        setTimeout(() => setRecentlyUpdatedStudent(null), 400)
    }, [recentlyUpdatedStudent, sortingAsc, sortingOrderby, sortingTextsearch, selectedSubjects])

    return (
        <MainPage
            columns={columns}
            students={students}
            allSubjects={allSubjects}
            recentlyUpdatedStudent={recentlyUpdatedStudent}
            setRecentlyUpdatedStudent={setRecentlyUpdatedStudent}

            sortingAsc={sortingAsc}
            setSortingAsc={setSortingAsc}
            sortingOrderby={sortingOrderby}
            setSortingOrderby={setSortingOrderby}
            sortingTextsearch={sortingTextsearch}
            setSortingTextsearch={setSortingTextsearch}
            selectedSubjects={selectedSubjects}
            setSelectedSubjects={setSelectedSubjects}
        />
    )
}
