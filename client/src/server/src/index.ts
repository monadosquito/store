import { ExpressDriver } from 'adapter/expressDriver'
import { PostgresqlRepo } from 'adapter/postgresqlRepo'

import { Client, QueryConfig } from 'pg'


import { Entity, validate } from 'core/user'
// const repo = new PostgresqlRepo({ user: 'postgres' })
// repo.connect()
// const drv = new ExpressDriver<Client>('auth', repo)
// drv.run(8000)

const user: Entity = { tag: 'namedUser', name_: '123', password: '21e', email: 'dffg@' }
const errs = validate(user)
console.log(errs)
