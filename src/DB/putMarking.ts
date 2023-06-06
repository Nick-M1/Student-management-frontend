export default async function putMarking(markingId: number, title: string, score: string) {
    const urlSearchParams = new URLSearchParams({
        title, score
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