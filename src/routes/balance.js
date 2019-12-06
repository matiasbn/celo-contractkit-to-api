import { Router } from 'express'
import Controller from '../controllers/balance'

const router = new Router()

router.post('/cusd', Controller.getUSDBalance)
router.post('/cgld', Controller.getGLDBalance)

export default router
