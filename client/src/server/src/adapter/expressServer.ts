import { configuration } from 'core/configuration'
import { User, UserSession, validate } from 'core/user'
import { IServer } from 'core/port/server'

import { Application, Request, Response } from 'express'
import { v4 } from 'uuid'

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
            async (req: Request<User>, res: Response) => {
                const user = req.body
                await this.repository.connect()
                const validUser = validate(user)
                if (!validUser) {
                    res.status(422).send()
                    return
                }
                const userExists = await this.repository.doesUserExist(user)
                if (userExists) {
                    res.status(409).send()
                    return
                }
                await this.repository.addUser(user)
                res.status(201).send()
            }
        )
    }
    signIn() {
        this.app.post('/sign-in', async (req: Request, res: Response) => {
            const user = req.body
            await this.repository.connect()
            const userId = await this.repository.selectUserId(user)
            if (!userId) {
                res.status(404).send()
                return
            }
            await this.repository.deleteUserSessionByUserId(userId)
            const sessionId = v4()
            await this.repository.addUserSession({ sessionId, userId })
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