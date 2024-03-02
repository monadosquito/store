interface IServer {
    repository: IRepository

    signUp: () => void
    signIn: () => void
    signOut: () => void
    isEmailFree: () => void
    confirmUserEmail: () => void
}


export { IServer }
