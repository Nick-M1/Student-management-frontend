export default async function deleteCourse(course: Course) {
    return await fetch(
        `http://localhost:8080/api/v1/courses/${course.id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
}