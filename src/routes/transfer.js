import { Router } from 'express'
import trimRequest from 'trim-request'
import Controller from '../controllers/transfer'
import validation from '../validators/transfer'
import validator from '../validators/validator'

const router = new Router()

router.post('/cusd',
  trimRequest.all,
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.transferCUSD)

router.post('/cgld',
  trimRequest.all,
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.transferCGLD)

export default router
