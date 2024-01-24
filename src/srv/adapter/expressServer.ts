import { User, UserSession } from 'core/user'
import { IServer } from 'core/port/server'

import e from 'express'
import { v4 } from 'uuid'


class ExpressServer implements IServer {
    users: User[]
    userSessions: UserSession[]
    app: e.Application

    constructor(users: User[], userSessions: UserSession[], app: any) {
        this.users = users
        this.userSessions = userSessions
        this.app = app
    }

    signUp() {
        this.app.post('/sign-up', (req: e.Request, res: e.Response) => {
            const user = req.body
            const { name, password } = user
            const userExists = this.users.some(user => {
                return (user.name === name && user.password === password)
            })
            if (userExists) {
                res.status(409).send()
                return
            }
            this.users.push(user)
            res.status(201).send()
        })
    }
    signIn() {
        this.app.post('/sign-in', (req: e.Request, res: e.Response) => {
            const user = req.body
            const { name, password } = user
            const userExists = this.users.some(user => {
                return (user.name === name && user.password === password)
            })
            if (!userExists) {
                res.status(404).send()
                return
            }
            const sessId = v4()
            const userI = this.users.findIndex(user => {
                user.name === name && user.password === password
            })
            const sess = { sessionId: sessId, userI: userI }
            this.userSessions.push(sess)
            res.cookie('sessId', sessId).status(204).send()
        })
    }
    signOut() {
        this.app.post('/auth/sign-out', (req: e.Request, res: e.Response) => {
            const sessId = req.cookies.sessId
            const sessI = this.userSessions.findIndex (({ sessionId }) => {
                sessionId === sessId
            })
            this.userSessions.splice(sessI, 1)
            res.clearCookie('sessId')
            res.status(204).send()
        })
    }
}


export { ExpressServer }
