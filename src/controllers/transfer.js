/* eslint-disable max-len */
import { debugControllers } from '~/src/config/debug'
import PrivateKey from '~/src/models/private-key'
import ERROR_MESSAGES from '~/src/common/error-messages'
import WORKER_NAMES from '~/src/common/worker-names'
import enqueueJob from '~/src/workers/'
import Logger from '~/src/config/logger'
import getSha256 from '~/src/helpers/get-sha-256'
import emitter from '~/src/config/emitter'
// import kit from '~/src/config/kit'

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
      const date = Date.now()
      const emitHash = getSha256([address, date, WORKER_NAMES.TRANSFER_CUSD])
      debugControllers(emitHash)
      const parameters = {
        privateKey, address, toAddress, amount, emitHash,
      }
      await enqueueJob(parameters, WORKER_NAMES.TRANSFER_CUSD)
      emitter.on(emitHash, (resp) => {
        const { success } = resp
        delete resp.success
        if (success) {
          response.success(resp)
        } else {
          response.error(resp)
        }
      })
    }
  } catch (error) {
    Logger.error(error)
    response.error(error, 500)
  }
}

export default {
  transferCUSD,
}
