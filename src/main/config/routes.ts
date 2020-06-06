import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(`${__dirname}/../routes`).map(async file => {
    if (!file.includes('.test.') && !file.endsWith('.map')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}

/* export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  const routesPath = path.resolve(__dirname, '..', 'routes')
  readdirSync(`${routesPath}`).map(async file => {
    if (!file.includes('.test.')) { (await import(`../routes/${file}`)).default(router) }
  })
} */
