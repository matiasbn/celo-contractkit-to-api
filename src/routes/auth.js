import { Router } from 'express'
import trimRequest from 'trim-request'
import Controller from '../controllers/auth'
import validation from '../validators/auth'
import validator from '../validators/validator'

import '../config/auth-strategies'

const router = new Router()

router.post('/login',
  trimRequest.all,
  validation.checkBody,
  validator,
  Controller.login)

router.post('/create',
  trimRequest.all,
  validation.checkCreate,
  validator,
  Controller.create)

export default router
