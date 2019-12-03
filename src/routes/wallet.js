import { Router } from 'express'
import Controller from '../controllers/wallet'

const router = new Router()

router.post('/hola', Controller.createWallet)

export default router
