import {
    User,
    NamedUser,
    IdUser,
    Entity,
    UserSession,
} from 'core/user'
import { IRepository } from 'core/port/repository'

import { Client, QueryConfig, QueryResult } from 'pg'

import { isValid } from 'core/validation/validation'


class PostgresqlRepo implements IRepository<Client> {
    client: Client | null
    conf: Record<string, number | string>

    constructor(conf: Record<string, number | string>) {
        this.client = null
        this.conf = conf
    }

    connect() {
        this.client = new Client(this.conf)
        this.client.connect()
    }
    end() {
        this.client?.end()
    }
    addUser(namedUser: NamedUser) {
        const user: Entity = { tag: 'namedUser', ...namedUser }
        const userIsValid = isValid(user)
        if (userIsValid) {
            const { name_, password, email } = user
            this.client?.query(
                'INSERT INTO user_ (name, password, email) VALUES ($1, $2, $3)',
                [ name_, password, email ]
            )
        }
    }
    async doesUserExist({ email }: User) {
        const qryRes = await this.client?.query(
            'SELECT EXISTS (SELECT FROM user_ WHERE email = $1)',
            [ email ]
        )
        return (qryRes?.rows[0]?.exists ?? false)
    }
    async selectUser(email: string): Promise<IdUser | undefined> {
        const qryRes = await this.client?.query(
            'SELECT * FROM user_ WHERE email = $1',
            [ email ]
        )
        return qryRes?.rows[0]
    }
    addUserSession({ sessionId, userId }: UserSession) {
        this.client?.query(
            'INSERT INTO user_session VALUES ($1, $2)',
            [ sessionId, userId ]
        )
    }
    async doesUserSessionExist(sessId: string) {
        const qryRes = await this.client?.query(
            'SELECT EXISTS (SELECT FROM user_session WHERE id = $1)',
            [ sessId ]
        )
        return (qryRes?.rows[0]?.exists ?? false)
    }
    deleteUserSessionById(userSessId: string) {
        this.client?.query(
            'DELETE FROM user_session WHERE id = $1',
            [ userSessId ]
        )
    }
    deleteUserSessionByUserId(userId: number) {
        this.client?.query(
            'DELETE FROM user_session WHERE user_id = $1',
            [ userId ]
        )
    }
}


export { PostgresqlRepo }
