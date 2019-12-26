/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator'
import utils from 'web3-utils'
import ERROR_MESSAGES from '../common/error-messages'

const isChecksumAddress = (address) => utils.checkAddressChecksum(address)

const checkBody = [
  body('address').exists().withMessage(ERROR_MESSAGES.ADDRESS_IS_EMPTY).bail(),
  body('toAddress').exists().withMessage(ERROR_MESSAGES.TO_ADDRESS_IS_EMPTY).bail(),
  body('amount').exists().withMessage(ERROR_MESSAGES.AMOUNT_IS_EMPTY).bail(),
]

const checkFormat = [
  body('address').custom((address) => isChecksumAddress(address)).withMessage(ERROR_MESSAGES.IS_NOT_CHECKSUM_ADDRESS),
  body('toAddress').custom((address) => isChecksumAddress(address)).withMessage(ERROR_MESSAGES.IS_NOT_CHECKSUM_ADDRESS),
  body('amount').isDecimal().withMessage(ERROR_MESSAGES.AMOUNT_IS_NOT_NUMBER),
]


export default {
  checkBody,
  checkFormat,
}
