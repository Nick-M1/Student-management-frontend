const defaultMarkingResponse: MarkingResponse = {
    markings: [],
    mean: {}
}

export default async function getMarking(studentId: string | number): Promise<MarkingResponse> {
    return await fetch(`http://localhost:8080/api/v1/marking/${studentId}/statistics`)
        .then(
            r => r.json(),
            () => defaultMarkingResponse
        )
}