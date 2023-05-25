export default async function getAllCourses(): Promise<Course[]> {
    return await fetch(`http://localhost:8080/api/v1/courses`)
        .then(
            r => r.json(),
            () => []
        )
}