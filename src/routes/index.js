import { Router } from 'express'
import responder from 'express-api-responder'
import WalletRoutes from './wallet'
import BalanceRoutes from './balance'

const router = new Router()

router.use(responder({
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
  .use('/balance', BalanceRoutes)

export default router
