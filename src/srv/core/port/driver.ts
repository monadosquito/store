import { IRepository } from 'core/port/repository'


interface IDriver<M> {
    repository: IRepository
    protectedEndpointPrefix: string
    
    authenticate: M
    run: () => void
}


export { IDriver }
