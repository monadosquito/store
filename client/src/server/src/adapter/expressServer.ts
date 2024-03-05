import { configuration } from 'core/configuration'
import { NamedUser, UserSession } from 'core/user'
import { IServer } from 'core/port/server'

import express, { Application, Request, Response } from 'express'
import { v4 } from 'uuid'
import { hash, compare } from 'bcrypt'

import { IRepository } from 'core/port/repository'
import { isValid } from 'core/validation/validation'
import { ProductCard, ForSaleProductCard } from 'core/product-card'
import { Ided } from 'core/utility'

import { createTransport } from 'nodemailer'
import multer from 'multer'


const upload = multer({ dest: 'pub/img' })


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
                if (!id) {
                    res.status(400).send()
                } else {
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
            res.cookie('sessId', sessionId).status(200).send(JSON.stringify({
                userId,
            }))
        })
    }
    signOut() {
        const endpoint = '/'
                       + configuration.protectedEndpointPrefix
                       + '/sign-out'
        this.app.get(endpoint, async (req: Request, res: Response) => {
            const userSessId = req.cookies.sessId
            await this.repository.connect()
            await this.repository.deleteUserSessionById(userSessId)
            res.clearCookie('sessId')
            res.status(204).send()
        })
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
    getAllProductCards() {
        this.app.get('/product/all', async (req, resp) => {
            const prodCards = await this.repository.getAllProductCards()
            resp.send(JSON.stringify(prodCards))
        })
    }
    getProductCard() {
        this.app.get('/product/:id', async (req, resp) => {
            const id = +req.params.id
            const prodCard = await this.repository.getProductCard(id)
            if (!prodCard) {
                resp.status(404).send()
                return
            }
            prodCard.images = await this.repository.getProductCardImages(id)
            resp.send(JSON.stringify(prodCard))
        })
    }
    addProductCard() {
        const endpoint = '/'
                       + configuration.protectedEndpointPrefix
                       + '/product/add'
        this.app.post(
            endpoint,
            upload.array('images', 10),
            async (req, resp) => {
                if (!Array.isArray(req.files)) {
                    resp.status(400).send()
                } else {
                    const images = req.files.map(img => img.filename) 
                    const sellerSessId = req.cookies.sessId
                    const sellerId = await this.repository.getUserSession(
                        sellerSessId
                    )
                    if (!sellerId) {
                        resp.status(401).send()
                    } else {
                        const mainImageIndex = +req.body.mainImageIndex
                                             || undefined
                        const prodCard: ProductCard = {
                            ...req.body,
                            images,
                            mainImageIndex,
                        }
                        const forSaleProdCard: ForSaleProductCard = {
                            sellerId,
                            ...prodCard,
                        }
                        this.repository.addProductCard(forSaleProdCard)
                    }
                }
        })
    }
    editProductCard() {
        const endpoint = '/'
                       + configuration.protectedEndpointPrefix
                       + '/product/edit/:id'
        this.app.post(
            endpoint,
            upload.array('images', 10),
            async (req, resp) => {
                const prodCardId = +req.params.id
                const prodCard = await this.repository.getProductCard(prodCardId)
                if (!prodCard) {
                    resp.status(404).send()
                    return
                } else {
                    if (!Array.isArray(req.files)) {
                        resp.status(400).send()
                    } else {
                        const images = req.files.map(img => img.filename) 
                        const sellerSessId = req.cookies.sessId
                        const sellerId = await this.repository.getUserSession(
                            sellerSessId
                        )
                        if (sellerId !== prodCard.sellerId) {
                            resp.status(403).send()
                            return
                        }
                        const editedProdCard: Ided<ForSaleProductCard> = {
                            ...req.body,
                            id: prodCardId,
                            sellerId,
                            images,
                        }
                        this.repository.editProductCard(editedProdCard)
                        resp.status(204).send()
                    }
            }
        })
    }
    deleteProductCard() {
        const endpoint = '/'
                       + configuration.protectedEndpointPrefix
                       + '/product/delete/:id'
        this.app.delete(endpoint, async (req, resp) => {
            const prodCardId = +req.params.id
            const prodCard = await this.repository.getProductCard(prodCardId)
            if (!prodCard) {
                resp.status(404).send()
                return
            } else {
                const sellerSessId = req.cookies.sessId
                const sellerId = await this.repository.getUserSession(
                    sellerSessId
                )
                if (sellerId !== prodCard.sellerId) {
                    resp.status(403).send()
                    return
                }
            }
            this.repository.deleteProductCard(prodCardId) 
            resp.status(204).send()
        })
    }
    serveFiles() {
        this.app.use('/img', express.static('pub/img'))
    }
    deleteProductCardImage() {
        const endpoint = '/'
                       + configuration.protectedEndpointPrefix
                       + '/product/image/delete/:id'
        this.app.delete(endpoint, async (req: Request, resp: Response) => {
            const id = +req.params.id
            const prodCard = await this.repository.getProductCardByImage(id)
            const sessId = req.cookies.sessId 
            const sellerId = await this.repository.getUserSession(sessId)
            if (!prodCard || prodCard.sellerId !== sellerId) {
                resp.status(403).send()
                return
            }
            this.repository.deleteProductCardImage(id) 
            resp.status(204).send()
        })
    }
}


export { ExpressServer }
