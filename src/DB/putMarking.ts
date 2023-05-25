export default async function putMarking(markingId: number, score: string) {
    const urlSearchParams = new URLSearchParams({
        score
    });

    return await fetch(
        `http://localhost:8080/api/v1/marking/${markingId}?${urlSearchParams}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
}