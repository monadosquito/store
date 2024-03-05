import {
    User,
    NamedUser,
    IdUser,
    Entity,
    UserSession,
} from 'core/user'
import { Ided, Maybe } from 'core/utility'
import {
    ProductCardImage,
    ProductCard,
    ForSaleProductCard,
} from 'core/product-card'
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

    async connect() {
        this.client = new Client(this.conf)
        await this.client.connect()
    }
    async end() {
        await this.client?.end()
    }
    async addUser(namedUser: NamedUser): Promise<Maybe<number>> {
        const user: Entity = { tag: 'namedUser', ...namedUser }
        const userIsValid = isValid([])(user)
        if (!userIsValid) {
            return null
        }
        const { name_, password, email } = user
        const res = await this.client?.query(
            'INSERT INTO user_ (name, password, email) VALUES ($1, $2, $3) \
                RETURNING id',
            [ name_, password, email ]
        )
        return res?.rows[0]?.id
    }
    async doesUserExist(email: string) {
        const qryRes = await this.client?.query(
            'SELECT EXISTS (SELECT FROM user_ WHERE email = $1)',
            [ email ]
        )
        return (qryRes?.rows[0]?.exists ?? false)
    }
    async selectUser(email: string): Promise<Maybe<Ided<NamedUser>>> {
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
    async getUserSession(sessId: string): Promise<Maybe<number>> {
        const qryRes = await this.client?.query(
            'SELECT user_id FROM user_session WHERE id = $1',
            [ sessId ],
        )
        return qryRes?.rows[0]?.user_id
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
    addUserVerification(code: string, userId: number): void {
        this.client?.query(
            'INSERT INTO user_ver VALUES ($1, $2)', [ code, userId ]
        )
    }
    async confirmUserEmail(code: string): Promise<void> {
        const qryRes = await this.client?.query(
            'SELECT user_id FROM user_ver WHERE code = $1',
            [ code ],
        )
        const userId = qryRes?.rows[0]?.user_id
        this.client?.query(
            'UPDATE user_ SET conf = TRUE WHERE id = $1', [ userId ]
        )
    }
    async getAllProductCards(): Promise<Ided<ForSaleProductCard>[]> {
        const res = await this.client?.query(
            'SELECT \
                id, \
                seller_id AS "sellerId", \
                name_, \
                description, \
                main_image_index AS "mainImageIndex" \
            FROM prod_card'
        )
        const resRows = res?.rows ?? []
        for (const prodCard of resRows) {
            prodCard.images = await this.getProductCardImages(prodCard.id)
        }
        return resRows
    }
    async getProductCard(id: number): Promise<Maybe<Ided<ForSaleProductCard>>> {
        const qryRes = await this.client?.query(
            'SELECT \
                id, \
                seller_id as "sellerId", \
                name_, \
                description, \
                main_image_index as "mainImageIndex" \
            FROM prod_card \
            WHERE id = $1',
            [ id ],
        )
        const images = await this.getProductCardImages(id)
        if (!qryRes?.rows[0]) {
            return null
        } else {
            const prodCard: Ided<ForSaleProductCard> = {
                ...qryRes.rows[0],
                images,
            }
            return prodCard
        }
    }
    async getProductCardByImage(
        id: number,
    ): Promise<Maybe<Ided<ForSaleProductCard>>> {
        const qryRes = await this.client?.query(
            'SELECT \
                prod_card.id, \
                prod_card.seller_id as "sellerId", \
                prod_card.name_, \
                prod_card.description, \
                prod_card.main_image_index as mainImageIndex \
            FROM prod_card_img \
            INNER JOIN prod_card \
            ON prod_card_img.prod_card_id = prod_card.id \
            WHERE prod_card_img.id = $1',
            [ id ],
        ) 
        return qryRes?.rows[0]
    }
    addProductCardImages({ id, images }: Ided<ProductCard>) {
        images.forEach((img) => {
            this.client?.query(
                'INSERT INTO prod_card_img (prod_card_id, name_) \
                VALUES ($1, $2)',
                [ id, img ],
            )
        })
    }
    async addProductCard(prodCard: ForSaleProductCard) {
        const { sellerId, name_, description } = prodCard
        const qryRes = await this.client?.query(
            'INSERT INTO prod_card (seller_id, name_, description) \
            VALUES ($1, $2, $3) RETURNING id',
            [ sellerId, name_, description ],
        )
        const id = qryRes?.rows[0].id
        if (id) {
            const idedProdCard = { ...prodCard, id }
            this.addProductCardImages(idedProdCard)
        }
    }
    editProductCard(prodCard: Ided<ForSaleProductCard>) {
        const { id, sellerId, name_, description, mainImageIndex } = prodCard
        this.client?.query(
            'UPDATE prod_card \
            SET \
                name_ = $1, \
                description = $2, \
                main_image_index = $3 \
            WHERE id = $4 AND seller_id = $5',
            [ name_, description, mainImageIndex, id, sellerId ],
        )
        this.addProductCardImages(prodCard)
    }
    deleteProductCard(id: number): void {
        this.client?.query('DELETE FROM prod_card WHERE id = $1', [ id ]) 
    }
    deleteProductCardImage(id: number): void {
        this.client?.query('DELETE FROM prod_card_img WHERE id = $1', [ id ])
    }
    async getProductCardImages(id: number): Promise<ProductCardImage[]> {
        const imgsQryRes = await this.client?.query(
            'SELECT id, name_ FROM prod_card_img WHERE prod_card_id = $1',
            [ id ]
        )
        return imgsQryRes?.rows ?? [] 
    }
}


export { PostgresqlRepo }
