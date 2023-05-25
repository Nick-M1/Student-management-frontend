export default async function deleteMarking(markingId: number) {
    return await fetch(
        `http://localhost:8080/api/v1/marking/${markingId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
}