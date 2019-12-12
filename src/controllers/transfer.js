/* eslint-disable max-len */
import { debugControllers } from '../config/debug'
import PrivateKey from '../models/private-key'
import ERROR_MESSAGES from '../common/error-messages'
import WORKER_NAMES from '../common/worker-names'
import { enqueueJob } from '../config/agenda'


const transferCUSD = async (request, response) => {
  try {
    debugControllers(request.body)
    const {
      email, phone, toAddress, amount,
    } = request.body
    const privKey = await PrivateKey.findOne({ email, phone }, { _id: 0, address: 1, privateKey: 1 }).lean()
    debugControllers(privKey)
    if (!privKey) {
      response.error(ERROR_MESSAGES.EMAIL_OR_PHONE_ALREADY_REGISTERED, 401)
    } else {
      const { privateKey, address } = privKey
      const parameters = {
        privateKey, address, toAddress, amount,
      }
      await enqueueJob(parameters, WORKER_NAMES.TRANSFER_CUSD)
      response.success(privKey)
    }
  } catch (error) {
    debugControllers(error)
    response.error(error, 500)
  }
}

export default {
  transferCUSD,
}
