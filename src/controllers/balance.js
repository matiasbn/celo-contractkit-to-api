import { debugControllers } from '../config/debug'
import PrivateKey from '../models/private-key'
import ERROR_MESSAGES from '../common/error-messages'
import usdBalance from '../helpers/get-usd-balance'
import gldBalance from '../helpers/get-gld-balance'

const getUSDBalance = async (request, response) => {
  const projections = {
    _id: 0, address: 1, email: 1, phone: 1,
  }
  try {
    const { email, phone } = request.body
    const privateKey = await PrivateKey.findOne({ email, phone }, projections).lean()
    if (!privateKey) {
      response.error(ERROR_MESSAGES.PRIVATE_KEY_NOT_FOUND, 401)
    } else {
      const balance = await usdBalance(privateKey.address)
      debugControllers(balance)
      response.success({ balance })
    }
  } catch (error) {
    response.error(error, 500)
  }
}

const getGLDBalance = async (request, response) => {
  const projections = {
    _id: 0, address: 1, email: 1, phone: 1,
  }
  try {
    const { email, phone } = request.body
    const privateKey = await PrivateKey.findOne({ email, phone }, projections).lean()
    if (!privateKey) {
      response.error(ERROR_MESSAGES.PRIVATE_KEY_NOT_FOUND, 401)
    } else {
      const balance = await gldBalance(privateKey.address)
      debugControllers(balance)
      response.success({ balance })
    }
  } catch (error) {
    response.error(error, 500)
  }
}
export default {
  getUSDBalance,
  getGLDBalance,
}
