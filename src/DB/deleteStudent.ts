export default async function deleteStudent(student: Student) {
    return await fetch(
        `http://localhost:8080/api/v1/student/${student.id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
}