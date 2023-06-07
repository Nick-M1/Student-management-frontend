export default async function signIn(username: string, password: string) {
    return await fetch(
        'http://localhost:8080/api/v1/auth/token',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        }
    )
}