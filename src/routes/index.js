import { Router } from 'express'
import responder from 'express-api-responder'
import WalletRoutes from './wallet'
import BalanceRoutes from './balance'
import TransferRoutes from './transfer'
import AuthRoutes from './auth'

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
  .use('/auth', AuthRoutes)
  .use('/balance', BalanceRoutes)
  .use('/transfer', TransferRoutes)
  .use('/wallet', WalletRoutes)

export default router
