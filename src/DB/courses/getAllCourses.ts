import {redirect} from "react-router-dom";

export default async function getAllCourses(jwtToken: string): Promise<Course[]> {
    return await fetch(`http://localhost:8080/api/v1/courses/all`, {
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