export default async function getAllStudentsByQuery(
    sortingAcs: boolean,
    sortingOrderby: string,
    sortingTextsearch: string,
    pageNumber: number,
    selectedSubjects: string[]
): Promise<Student[]> {

    const urlParams = new URLSearchParams({
        searchBy: sortingTextsearch,
        orderBy: sortingOrderby,
        isAsc: sortingAcs ? 'true' : 'false',
        'page': pageNumber.toString()
    });

    selectedSubjects.forEach(i => urlParams.append('subjects', i));

    return await fetch(`http://localhost:8080/api/v1/student?${urlParams}`)
        .then(
            res => res.json(),
            () => []
        )
}

