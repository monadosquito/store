import { IRepository } from 'core/port/repository'


interface IDriver<M> {
    repository: IRepository
    
    authenticate: M
    run: () => void
}


export { IDriver }
