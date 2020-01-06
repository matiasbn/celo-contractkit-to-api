import { Router } from 'express'
import trimRequest from 'trim-request'
import Controller from '../controllers/balance'
import validation from '../validators/balance'
import validator from '../middlewares/validator'

const router = new Router()

router
  .use(trimRequest.all)

router.get('/cusd',
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.getUSDBalance)

router.get('/cgld',
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.getGLDBalance)

export default router
