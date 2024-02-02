interface IServer {
    repository: IRepository
    protectedEndpointPrefix: string

    signUp: () => void
    signIn: () => void
    signOut: () => void
}


export { IServer }
