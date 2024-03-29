export default async function postMarking(jwtToken: string, courseId: number, title: string, score: string, studentId: number | string) {
    const newMarking = {
        title,
        score,

        course: {
            id: courseId
        },

        student: {
            id: studentId
        }
    }

    return await fetch(
        'http://localhost:8080/api/v1/marking',
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMarking),
        }
    )
}