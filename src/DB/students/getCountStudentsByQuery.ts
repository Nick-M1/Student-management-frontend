import {redirect} from "react-router-dom";

export default async function getCountStudentsByQuery(
    jwtToken: string,
    sortingTextsearch: string,
    selectedSubjects: string[]
): Promise<number> {

    const urlParams = new URLSearchParams({
        searchBy: sortingTextsearch,
    });

    selectedSubjects.forEach(i => urlParams.append('subjects', i));

    return await fetch(`http://localhost:8080/api/v1/student/count?${urlParams}`, {
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

