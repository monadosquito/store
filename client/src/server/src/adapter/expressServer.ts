import { configuration } from 'core/configuration'
import { NamedUser, UserSession, isValid } from 'core/user'
import { IServer } from 'core/port/server'

import { Application, Request, Response } from 'express'
import { v4 } from 'uuid'
import { hash, compare } from 'bcrypt'

import { IRepository } from 'core/port/repository'


class ExpressServer<Conn> implements IServer {
    app: Application
    repository: IRepository<Conn>

    constructor(app: any, repo: IRepository<Conn>) {
        this.app = app
        this.repository = repo 
    }

    signUp() {
        this.app.post(
            '/sign-up',
            async (req: Request<NamedUser>, res: Response) => {
                const user = req.body
                await this.repository.connect()
                const userIsValid = isValid(user)
                if (!userIsValid) {
                    res.status(422).send()
                    return
                }
                const userExists = await this.repository.doesUserExist(user)
                if (userExists) {
                    res.status(409).send()
                    return
                }
                const { password } = user
                const passwordHash = await hash(password, 10)
                await this.repository.addUser(
                    {...user, password: passwordHash }
                )
                res.status(201).send()
            }
        )
    }
    signIn() {
        this.app.post('/sign-in', async (req: Request, res: Response) => {
            const { email, password } = req.body
            await this.repository.connect()
            const user = await this.repository.selectUser(email)
            console.log(user)
            if (!user) {
                res.status(404).send()
                return
            }
            const { id, password: passwordHash } = user
            const passwordsMatch = await compare(password, passwordHash)
            if (!passwordsMatch) {
                res.status(403).send()
                return
            }
            await this.repository.deleteUserSessionByUserId(id)
            const sessionId = v4()
            await this.repository.addUserSession({ sessionId, id })
            res.cookie('sessId', sessionId).status(204).send()
        })
    }
    signOut() {
        this.app.get(
            '/' + configuration.protectedEndpointPrefix + '/sign-out',
            async (req: Request, res: Response) => {
                const userSessId = req.cookies.sessId
                await this.repository.connect()
                await this.repository.deleteUserSessionById(userSessId)
                res.clearCookie('sessId')
                res.status(204).send()
            }
        )
    }
}


export { ExpressServer }
