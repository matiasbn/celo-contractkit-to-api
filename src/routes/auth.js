import { Router } from 'express'
import trimRequest from 'trim-request'
import Controller from '../controllers/auth'
import validation from '../validators/auth'
import validator from '../middlewares/validator'

import '../config/auth-strategies'
import jwtAuth from '../middlewares/jwt-auth'

const router = new Router()

router
  .use(trimRequest.all)

router.post('/login',
  validation.checkBody,
  validator,
  Controller.login)

router.post('/create',
  validation.checkCreate,
  validator,
  Controller.create)

router.post('/refresh',
  validation.checkRefresh,
  validator,
  Controller.refresh)

router.post('/delete',
  jwtAuth,
  Controller.del)

export default router
