import { ExpressDriver } from 'adapter/expressDriver'
import { PostgresqlRepo } from 'adapter/postgresqlRepo'

import { Client, QueryConfig } from 'pg'


import { validate } from 'core/user'
const repo = new PostgresqlRepo({ user: 'postgres' })
repo.connect()
const drv = new ExpressDriver<Client>('auth', repo)
drv.run(8000)
