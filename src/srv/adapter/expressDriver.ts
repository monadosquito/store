import { User, UserSession } from 'core/user'
import { IDriver } from 'core/port/driver'
import { ExpressServer } from 'adapters/expressServer'

import e from 'express'
import cookieParser from 'cookie-parser'


const users: User[] = []
const userSessions: UserSession[] = []
const app = e()


app.use(e.json())
app.use(cookieParser())


const authMid = (req: e.Request, res: e.Response, next: e.NextFunction) => {
    const authRequired = req.url.startsWith("/auth")
    if (authRequired) {
        const sessId = req.cookies.sessId
        if (!sessId) {
            res.status(401).send()
            return
        } 
        const userSessExists = userSessions.some((userSession: UserSession) => {
            return (userSession.sessionId === sessId)
        })
        if (!userSessExists) {
            res.status(401).send()
            return
        }
        next ()
        return
    }
    next ()
}

app.use(authMid)


class ExpressDriver implements IDriver {
    run() {
        const srv = new ExpressServer(users, userSessions, app)
        srv.signUp()
        srv.signIn()
        srv.signOut()

        app.listen(8000)
    }
}


export { ExpressDriver }
