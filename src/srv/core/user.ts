type User = {
    name: string
    password: string
    email: string
}

type UserSession = {
    sessionId: string
    userId: number
}


export { User, UserSession }
