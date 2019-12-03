import { Router } from 'express'
import expressApiResponder from 'express-api-responder'

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

// router
//   .use('/auth', AuthRoutes)
//   .use('/companies', CompanyRoutes)
//   .use('/energyFees', EnergyFeeRoutes)
//   .use('/meters', MeterRoutes)
//   .use('/netatmo', NetatmoRoutes)
//   .use('/profile', ProfileRoutes)
//   .use('/report', ReportRoutes)
//   .use('/users', UserRoutes)
//   .use('/wenuSwitch', WenuSwitchRoutes)

export default router
