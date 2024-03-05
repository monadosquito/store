import { User, NamedUser, UserSession } 'core/user'
import { ProductCardImage, ProductCard, ForSaleProductCard } 'core/product-card'
import { Ided, Maybe } 'core/utility'


interface IRepository<Client> {
    client: Client | null

    connect: () => void
    end: () => void
    addUser: (user: NamedUser) => Promise<Maybe<number>>
    doesUserExist: (email: string) => Promise<boolean>
    selectUser: (email: string) => Promise<Maybe<Ided<NamedUser>>>
    addUserSession: (userSession: UserSession) => void
    getUserSession: (id: string) => Promise<Maybe<number>>
    deleteUserSessionById: (id: string) => void
    deleteUserSessionByUserId: (userId: number) => void
    addUserVerification: (code: string, userId: number) => void
    confirmUserEmail: (code: string) => Promise<void>
    getAllProductCards: () => Promise<Ided<ForSaleProductCard>[]>
    getProductCard: (id: number) => Promise<Maybe<Ided<ForSaleProductCard>>>
    private addProductCardImages: (productCard: Ided<ProductCard>) => void
    addProductCard: (productCard: ForSaleProductCard) => void
    editProductCard: (productCard: Ided<ForSaleProductCard>) => void
    deleteProductCard: (id: number) => void
    deleteProductCardImage: (id: number) => void
    getProductCardByImage: (
        id: number,
    ) => Promise<Maybe<Ided<ForSaleProductCard>>>
    private getProductCardImages: (id: number) => Promise<ProductCardImage[]>
}


export { IRepository }
