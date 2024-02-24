interface IServer {
    repository: IRepository

    signUp: () => void
    signIn: () => void
    signOut: () => void
}


export { IServer }
