/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator'
import utils from 'web3-utils'
import ERROR_MESSAGES from '../common/error-messages'

const isChecksumAddress = (address) => utils.checkAddressChecksum(address)

const checkBody = [
  body('address').exists().withMessage(ERROR_MESSAGES.ADDRESS_IS_EMPTY).bail(),
]

const checkFormat = [
  body('address').trim().custom((address) => isChecksumAddress(address)).withMessage(ERROR_MESSAGES.IS_NOT_EMAIL),
]


export default {
  checkBody,
  checkFormat,
}
