export default async function getMarkingStatistics(studentId: number): Promise<MarkingStatistics> {
    return await fetch(`http://localhost:8080/api/v1/marking/${studentId}/statistics`)
        .then(
            res => res.json(),
            () => []
        )
}