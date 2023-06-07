import {redirect} from "react-router-dom";

export default async function getMarkingPage(
    jwtToken: string,
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

    return await fetch(`http://localhost:8080/api/v1/marking/${studentId}?${urlParams}`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }

    }).then(
        res => {
            if (res.status === 401)
                throw redirect("/signin")
            return res.json()
        },
        () => []
    )
}