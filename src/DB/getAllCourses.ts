export default async function getAllCoursesByQuery(): Promise<Course[]> {
    return await fetch(`http://localhost:8080/api/v1/courses/all`)
        .then(
            r => r.json(),
            () => []
        )
}