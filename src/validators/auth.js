/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator'
import ERROR_MESSAGES from '../common/error-messages'

const checkBody = [
  body('name').exists().withMessage(ERROR_MESSAGES.NAME_IS_EMPTY).bail(),
  body('password').exists().withMessage(ERROR_MESSAGES.PASSWORD_IS_EMPTY).bail(),
]

const checkCreate = [
  body('name').exists().withMessage(ERROR_MESSAGES.NAME_IS_EMPTY).bail(),
  body('password').exists().withMessage(ERROR_MESSAGES.PASSWORD_IS_EMPTY).bail(),
  body('secret').exists().withMessage(ERROR_MESSAGES.SECRET_IS_EMPTY).bail(),
]

const checkRefresh = [
  body('refreshToken').exists().withMessage(ERROR_MESSAGES.REFRESH_TOKEN_IS_EMPTY).bail(),
]


export default {
  checkBody,
  checkCreate,
  checkRefresh,
}
