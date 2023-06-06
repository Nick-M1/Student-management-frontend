export default async function getStudentById(studentId: string): Promise<Student> {
    return await fetch(`http://localhost:8080/api/v1/student/${studentId}`)
        .then(
            r => r.json(),
            () => {
                throw new Error(`Student not found with id ${studentId}`)
            }
        )
}