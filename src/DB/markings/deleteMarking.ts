export default async function deleteMarking(jwtToken: string, markingId: number) {
    return await fetch(
        `http://localhost:8080/api/v1/marking/${markingId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
        }
    )
}