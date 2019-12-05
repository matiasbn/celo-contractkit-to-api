import { Router } from 'express'
import Controller from '../controllers/balance'

const router = new Router()

router.post('/cusd', Controller.createWallet)
router.post('/cgld', Controller.fetchWallet)

export default router
