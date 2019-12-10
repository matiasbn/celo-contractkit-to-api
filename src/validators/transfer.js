/* eslint-disable newline-per-chained-call */
import web3 from 'web3-utils'
import { body } from 'express-validator'
import ERROR_MESSAGES from '../common/error-messages'

const isChecksumAddress = (address) => web3.checkAddressChecksum(address)

const checkBody = [
  body('email').exists().withMessage(ERROR_MESSAGES.EMAIL_IS_EMPTY).bail(),
  body('phone').exists().withMessage(ERROR_MESSAGES.PHONE_IS_EMPTY).bail(),
  body('toAddress').exists().withMessage(ERROR_MESSAGES.TO_ADDRESS_IS_EMPTY).bail(),
  body('amount').exists().withMessage(ERROR_MESSAGES.AMOUNT_IS_EMPTY).bail(),
]

const checkFormat = [
  body('email').isEmail().withMessage(ERROR_MESSAGES.IS_NOT_EMAIL),
  body('phone').isMobilePhone().withMessage(ERROR_MESSAGES.IS_NOT_PHONE),
  body('toAddress').custom((address) => isChecksumAddress(address)).withMessage(ERROR_MESSAGES.IS_NOT_CHECKSUM_ADDRESS),
  body('amount').isDecimal().withMessage(ERROR_MESSAGES.AMOUNT_IS_NOT_NUMBER),
]


export default {
  checkBody,
  checkFormat,
}
