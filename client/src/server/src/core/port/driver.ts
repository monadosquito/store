import { IRepository } from 'core/port/repository'


interface IDriver<M extends (args...) => void> {
    repository: IRepository
    protectedEndpointPrefix: string
    
    authenticate: M
    run: (port: number) => void
}


export { IDriver }
