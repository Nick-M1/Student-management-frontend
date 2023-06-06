export default async function getAllDepartments(): Promise<string[]> {
    return await fetch('http://localhost:8080/api/v1/courses/departments')
        .then(
            res => res.json(),
            () => []
        )
}

