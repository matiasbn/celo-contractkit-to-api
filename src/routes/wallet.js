import { Router } from 'express'
import trimRequest from 'trim-request'
import Controller from '../controllers/wallet'
import validation from '../validators/wallet'
import validator from '../validators/validator'

const router = new Router()

router.post('/create',
  trimRequest.all,
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.createWallet)

router.get('/fetch',
  trimRequest.all,
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.fetchWallet)

router.post('/delete',
  trimRequest.all,
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.deleteWallet)

export default router
