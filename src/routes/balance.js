import { Router } from 'express'
import trimRequest from 'trim-request'
import Controller from '../controllers/balance'
import validation from '../validators/balance'
import validator from '../validators/validator'

const router = new Router()

router.get('/cusd',
  trimRequest.all,
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.getUSDBalance)

router.get('/cgld',
  trimRequest.all,
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.getGLDBalance)

export default router
