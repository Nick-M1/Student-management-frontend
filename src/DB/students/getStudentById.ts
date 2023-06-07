import {redirect} from "react-router-dom";

export default async function getStudentById(jwtToken: string, studentId: string): Promise<Student> {
    return await fetch(`http://localhost:8080/api/v1/student/${studentId}`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    }).then(
        res => {
            if (res.status === 401)
                throw redirect("/signin")
            else if (res.status === 403)
                throw redirect("/")
            else if (!res.ok)
                throw new Error(`Student not found with id ${studentId}`)

            return res.json()
        }
    )
}