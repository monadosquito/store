import { ExpressDriver } from 'adapter/expressDriver'
import { PostgresqlRepo } from 'adapter/postgresqlRepo'

import { Client, QueryConfig } from 'pg'


const repo = new PostgresqlRepo({ user: 'postgres' })
repo.connect()
const drv = new ExpressDriver<Client>('auth', repo)
drv.run()
