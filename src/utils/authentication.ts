import {redirect} from "react-router-dom";

const JWT_TOKEN_LOCALSTORAGEKEY = 'studentmanagement_jwttoken'
const JWT_ROLE_LOCALSTORAGEKEY = 'studentmanagement_role'
const JWT_ID_LOCALSTORAGEKEY = 'studentmanagement_id'


export function getJwtTokenOrThrow() {
    const jwtToken = localStorage.getItem(JWT_TOKEN_LOCALSTORAGEKEY)
    const role = localStorage.getItem(JWT_ROLE_LOCALSTORAGEKEY)
    const id = localStorage.getItem(JWT_ID_LOCALSTORAGEKEY)

    if (jwtToken === null || role === null || id === null)
        throw redirect("/signin")           // redirect() only works in loaders & actions funcs

    return { jwtToken, role, userId: id }
}

export function updateJwtToken(jwtToken: string, role: string, id: string) {
    localStorage.setItem(JWT_TOKEN_LOCALSTORAGEKEY, jwtToken)
    localStorage.setItem(JWT_ROLE_LOCALSTORAGEKEY, role)
    localStorage.setItem(JWT_ID_LOCALSTORAGEKEY, id)
}

export function removeJwtToken() {
    localStorage.removeItem(JWT_TOKEN_LOCALSTORAGEKEY)
    localStorage.removeItem(JWT_ROLE_LOCALSTORAGEKEY)
    localStorage.removeItem(JWT_ID_LOCALSTORAGEKEY)
}

export function isAdminFunc(role: string) {
    return role === "ADMIN"
}