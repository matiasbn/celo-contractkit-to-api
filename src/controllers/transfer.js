/* eslint-disable max-len */
import { debugControllers } from '../config/debug'
import PrivateKey from '../models/private-key'
import ERROR_MESSAGES from '../common/error-messages'
import WORKER_NAMES from '../common/worker-names'
import enqueueJob from '../workers'
import Logger from '../config/logger'
import getSha256 from '../helpers/get-sha-256'
import emitter from '../config/emitter'
import usdBalance from '~/src/helpers/get-usd-balance'
import gldBalance from '~/src/helpers/get-gld-balance'

const transferCUSD = async (request, response) => {
  try {
    debugControllers('request body: \n', request.body)
    const {
      address, toAddress, amount,
    } = request.body
    const privKey = await PrivateKey.findOne({ address }, { _id: 0, privateKey: 1 }).lean()
    debugControllers('privateKey:', privKey)
    if (!privKey) {
      response.error(ERROR_MESSAGES.WALLET_NOT_FOUND, 401)
    } else {
      const balance = await usdBalance(address)
      if (balance.toNumber() < amount) {
        response.error({ message: ERROR_MESSAGES.INSUFFICIENT_FUNDS, balance: balance.toNumber().toString(), amount }, 401)
      } else {
        const date = Date.now()
        const { privateKey } = privKey
        const emitHash = getSha256([address, date, WORKER_NAMES.TRANSFER_CUSD])
        debugControllers('emithHash:', emitHash)
        const parameters = {
          privateKey,
          address,
          toAddress,
          amount,
          emitHash,
          jobType: WORKER_NAMES.TRANSFER_CUSD,
        }
        await enqueueJob(parameters)
        emitter.on(emitHash, (resp) => {
          debugControllers('job response: \n', resp)
          const { success } = resp
          delete resp.success
          if (success) {
            response.success(resp)
          } else {
            response.error(resp, 500)
          }
        })
      }
    }
  } catch (error) {
    Logger.error(error)
    response.error(error, 500)
  }
}

const transferCGLD = async (request, response) => {
  try {
    debugControllers('request body: \n', request.body)
    const {
      address, toAddress, amount,
    } = request.body
    const privKey = await PrivateKey.findOne({ address }, { _id: 0, privateKey: 1 }).lean()
    debugControllers('privateKey:', privKey)
    if (!privKey) {
      response.error(ERROR_MESSAGES.WALLET_NOT_FOUND, 401)
    } else {
      const balance = await gldBalance(address)
      if (balance.toNumber() < amount) {
        response.error({ message: ERROR_MESSAGES.INSUFFICIENT_FUNDS, balance: balance.toNumber().toString(), amount }, 401)
      } else {
        const date = Date.now()
        const emitHash = getSha256([address, date, WORKER_NAMES.TRANSFER_CGLD])
        const { privateKey } = privKey
        debugControllers('emithHash:', emitHash)
        const parameters = {
          privateKey,
          address,
          toAddress,
          amount,
          emitHash,
          jobType: WORKER_NAMES.TRANSFER_CGLD,
        }
        await enqueueJob(parameters)
        emitter.on(emitHash, (resp) => {
          debugControllers('job response: \n', resp)
          const { success } = resp
          delete resp.success
          if (success) {
            response.success(resp)
          } else {
            response.error(resp, 500)
          }
        })
      }
    }
  } catch (error) {
    Logger.error(error)
    response.error(error, 500)
  }
}

export default {
  transferCUSD,
  transferCGLD,
}
