/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator'
import ERROR_MESSAGES from '../common/error-messages'

const checkBody = [
  body('email').exists().withMessage(ERROR_MESSAGES.EMAIL_IS_EMPTY).bail(),
  body('phone').exists().withMessage(ERROR_MESSAGES.PHONE_IS_EMPTY).bail(),
]

const checkFormat = [
  body('email').isEmail().withMessage(ERROR_MESSAGES.IS_NOT_EMAIL),
  body('phone').isMobilePhone().withMessage(ERROR_MESSAGES.IS_NOT_PHONE),
]


export default {
  checkBody,
  checkFormat,
}
