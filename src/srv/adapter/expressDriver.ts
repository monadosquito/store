import { UserSession } from 'core/user'
import { IDriver } from 'core/port/driver'
import { ExpressServer } from 'adapter/expressServer'

import e, { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'

import { IRepository } from 'core/port/repository'


type ExpressMid = (
    request: Request,
    response: Response,
    next: NextFunction,
) => Promise<void>


const app = e()


app.use(e.json())
app.use(cookieParser())


class ExpressDriver<Conn> implements IDriver<ExpressMid> {
    repository: IRepository<Conn>
    protectedEndpointPrefix: string

    constructor(protEndpointPrefix: string, repo: IRepository<Conn>) {
        this.repository = repo
        this.protectedEndpointPrefix = protEndpointPrefix
    }
    
    async authenticate (req: Request, res: Response, next: NextFunction) {
        const authRequired = req.url.startsWith(
            '/' + this.protectedEndpointPrefix
        )
        if (authRequired) {
            const sessId = req.cookies.sessId
            if (!sessId) {
                res.status(401).send()
                return
            } 
            await this.repository.connect()
            const userSessExists = await this.repository
                                             .doesUserSessionExist(sessId)
            console.log(userSessExists)
            if (!userSessExists) {
                res.status(401).send()
                return
            }
            next ()
            return
        }
        next ()
    }

    run(port: number) {
        const srv = new ExpressServer(
            this.protectedEndpointPrefix,
            app,
            this.repository,
        )
        srv.signUp()
        srv.signIn()
        srv.signOut()

        // app.use(this.authenticate)
        app.listen(8000)
    }
}


export { ExpressDriver }
