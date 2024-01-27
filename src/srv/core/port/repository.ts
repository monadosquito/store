import 'core/user'


interface IRepository<Client> {
    client: Client | null

    connect: () => void
    end: () => void
    addUser: (user: User) => void
    doesUserExist: (user: User) => Promise<boolean>
    selectUserId: (user: User) => Promise<number | null>
    addUserSession: (userSession: UserSession) => void
    doesUserSessionExist: (id: string) => Promise<boolean>
    deleteUserSessionById: (id: string) => void
    deleteUserSessionByUserId: (userId: number) => void
}


export { IRepository }
