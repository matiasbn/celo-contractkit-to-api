import { Router } from 'express'
import trimRequest from 'trim-request'
import Controller from '../controllers/transfer'
import validation from '../validators/transfer'
import validator from '../validators/validator'
import jwtAuth from '../middlewares/jwt-auth'

const router = new Router()

// Authenticated route
router
  .use(jwtAuth)
  .use(trimRequest.all)

router.post('/cusd',
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.transferCUSD)

router.post('/cgld',
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.transferCGLD)

export default router
