export default async function getStudentById(studentId: string): Promise<Student | null> {
    return await fetch(`http://localhost:8080/api/v1/student/${studentId}`)
        .then(
            r => r.json(),
            () => null
        )
}