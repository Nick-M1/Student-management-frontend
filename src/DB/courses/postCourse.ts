export default async function postCourse(jwtToken: string, code: string, title: string, department: string) {
    const newCourse = {
        code, title, department
    }

    return await fetch(
        'http://localhost:8080/api/v1/courses',
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCourse),
        }
    )
}