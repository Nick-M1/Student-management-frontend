export default async function getAllSubjects(): Promise<string[]> {
    return await fetch('http://localhost:8080/api/v1/student/subjects')
        .then(
            res => res.json(),
            () => []
        )
}

