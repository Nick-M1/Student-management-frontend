import {redirect} from "react-router-dom";

export default async function getMarkingStatistics(jwtToken: string, studentId: number): Promise<MarkingStatistics> {
    return await fetch(`http://localhost:8080/api/v1/marking/${studentId}/statistics`, {
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