export default async function getCountStudentsByQuery(
    sortingTextsearch: string,
    selectedSubjects: string[]
): Promise<number> {

    const urlParams = new URLSearchParams({
        searchBy: sortingTextsearch,
    });

    selectedSubjects.forEach(i => urlParams.append('subjects', i));

    return await fetch(`http://localhost:8080/api/v1/student/count?${urlParams}`)
        .then(
            res => res.json(),
            () => 0
        )
}

