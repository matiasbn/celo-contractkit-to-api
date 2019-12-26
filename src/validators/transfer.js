/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator'
import { newKit } from '@celo/contractkit'
import ERROR_MESSAGES from '../common/error-messages'

const isChecksumAddress = (address) => {
  const kit = newKit(process.env.CELO_URL)
  try {
    return kit.web3.utils.checkAddressChecksum(address)
  } finally {
    if (typeof kit.web3.currentProvider.stop === 'function') {
      kit.web3.currentProvider.stop()
    }
  }
}

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
