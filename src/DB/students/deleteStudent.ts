export default async function deleteStudent(jwtToken: string, student: Student) {
    return await fetch(
        `http://localhost:8080/api/v1/student/${student.id}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
        }
    )
}