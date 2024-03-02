import { configuration } from 'core/configuration'
import { NamedUser, UserSession } from 'core/user'
import { IServer } from 'core/port/server'

import { Application, Request, Response } from 'express'
import { v4 } from 'uuid'
import { hash, compare } from 'bcrypt'

import { IRepository } from 'core/port/repository'
import { isValid } from 'core/validation/validation'

import { createTransport } from 'nodemailer'


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
                const userExists = await this.repository.doesUserExist(
                    user.email
                )
                if (userExists) {
                    res.status(409).send()
                    return
                }
                const { password } = user
                const passwordHash = await hash(password, 10)
                const id = await this.repository.addUser(
                    { ...user, password: passwordHash }
                )
                const verCode = v4()
                this.repository.addUserVerification(verCode, id)
                const mailTrans = createTransport({
                    service: process.env.EMAIL_SERVICE,
                    auth: {
                        user: process.env.EMAIL_ADDRESS,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                })
                const confUrl = new URL('http://localhost:8000/user/confirm')
                confUrl.searchParams.set('code', verCode)
                const mailOpts = {
                    to: user.email,
                    subject: 'Store: E-Mail Confirmation',
                    html: `<a href=${confUrl}>Confirm</a>`,
                }
                mailTrans.sendMail(mailOpts)
                res.status(201).send()
            }
        )
    }
    signIn() {
        this.app.post('/sign-in', async (req: Request, res: Response) => {
            const { email, password } = req.body
            await this.repository.connect()
            const user = await this.repository.selectUser(email)
            if (!user) {
                res.status(404).send()
                return
            }
            const { id: userId, password: passwordHash } = user
            const passwordsMatch = await compare(password, passwordHash)
            if (!passwordsMatch) {
                res.status(403).send()
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
    isEmailFree() {
        this.app.get('/user', async (req: Request, res: Response) => {
            const email = req.query.email as string
            if (!email) {
                res.status(400).send()
            }
            const userExists = await this.repository.doesUserExist(email)
            res.status(200).send(JSON.stringify({ emailFree: !userExists }))
        })
    }
    confirmUserEmail() {
        this.app.get('/user/confirm', async (req, resp) => {
            const code = req.query.code as string
            this.repository.confirmUserEmail(code)
            resp.send()
        })
    }
}


export { ExpressServer }
