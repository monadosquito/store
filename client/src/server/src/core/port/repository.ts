import 'core/user'
import 'core/utility'


interface IRepository<Client> {
    client: Client | null

    connect: () => void
    end: () => void
    addUser: (user: User) => Promise<Maybe<number>>
    doesUserExist: (email: string) => Promise<boolean>
    selectUser: (email: string) => Promise<NamedUser | undefined>
    addUserSession: (userSession: UserSession) => void
    doesUserSessionExist: (id: string) => Promise<boolean>
    deleteUserSessionById: (id: string) => void
    deleteUserSessionByUserId: (userId: number) => void
    addUserVerification: (code: string, userId: number) => void
    confirmUserEmail: (code: string) => Promise<void>
}


export { IRepository }
