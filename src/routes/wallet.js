import { Router } from 'express'
import Controller from '../controllers/wallet'

const router = new Router()

router.post('/create', Controller.createWallet)
router.post('/fetch', Controller.fetchWallet)

export default router
