/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator'

const checkLogin = [
//   body('email').trim().isEmail().withMessage(l.empty.email),
//   body('password').trim().not().isEmpty().withMessage(l.empty.password),
]

const checkRefreshToken = [
  body('uid').trim().isMongoId(),
  body('refresh_token').trim().not().isEmpty(),
]

const checkImpersonation = [
  body('userId').trim().isMongoId(),
]

export default {
  checkLogin,
  checkRefreshToken,
  checkImpersonation,
}
