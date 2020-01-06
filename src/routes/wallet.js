import { Router } from 'express'
import trimRequest from 'trim-request'
import Controller from '../controllers/wallet'
import validation from '../validators/wallet'
import validator from '../middlewares/validator'
import jwtAuth from '../middlewares/jwt-auth'

const router = new Router()

// Authenticated route
router
  .use(jwtAuth)
  .use(trimRequest.all)

router.post('/create',
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.createWallet)

router.get('/fetch',
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.fetchWallet)

router.post('/delete',
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.deleteWallet)

router.post('/update',
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.updateWallet)

export default router
