export default async function deleteCourse(jwtToken: string, course: Course) {
    return await fetch(
        `http://localhost:8080/api/v1/courses/${course.id}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
        }
    )
}