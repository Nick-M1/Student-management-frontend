export default async function putCourse(courseId: number, code: string, title: string, department: string) {
    const urlSearchParams = new URLSearchParams({
        code, title, department
    });

    return await fetch(
        `http://localhost:8080/api/v1/courses/${courseId}?${urlSearchParams}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
}