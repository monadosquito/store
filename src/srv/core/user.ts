type User = {
    name: string
    password: string
}

type UserSession = {
    sessionId: string
    userId: number
}


export { User, UserSession }
