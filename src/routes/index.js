import { Router } from 'express'
import expressApiResponder from 'express-api-responder'
import WalletRoutes from './wallet'

const router = new Router()

router.use(expressApiResponder({
  includeCode: 'status',
  includeSuccess: 'success',
}))

router.get('/', (request, response) => {
  const parsedResponse = {
    uptime: process.uptime(),
  }

  return response.success({ data: parsedResponse })
})

router
  .use('/wallet', WalletRoutes)

export default router
