import { IRepository } from 'core/port/repository'


interface IServer {
    repository: IRepository

    signUp: () => void
    signIn: () => void
    signOut: () => void
    isEmailFree: () => void
    confirmUserEmail: () => void
    getAllProductCards: () => void
    getProductCard: () => void
    addProductCard: () => void
    editProductCard: () => void
    deleteProductCard: () => void
    serveFiles: () => void
}


export { IServer }
