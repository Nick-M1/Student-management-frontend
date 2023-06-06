export default async function getMarkingPage(
    studentId: string | number,
    sortingAcs: boolean,
    sortingOrderby: string,
    sortingTextsearch: string,
    pageNumber: number,
): Promise<Pageable<Marking>> {         // MarkingResponse

    const urlParams = new URLSearchParams({
        searchBy: sortingTextsearch,
        orderBy: sortingOrderby,
        isAsc: sortingAcs ? 'true' : 'false',
        'page': pageNumber.toString()
    });

    return await fetch(`http://localhost:8080/api/v1/marking/${studentId}?${urlParams}`)     // '/statistics'
        .then(
            r => r.json(),
            () => []
        )
}