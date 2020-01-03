/* eslint-disable max-len */
import { newKit } from '@celo/contractkit'
import { debugControllers } from '../config/debug'
import PrivateKey from '../models/private-key'
import ERROR_MESSAGES from '../common/error-messages'

const keySize = Number(process.env.KEY_SIZE)

const createWallet = async (request, response) => {
  const kit = newKit(process.env.CELO_URL)
  try {
    debugControllers('request body: \n', request.body)
    const { phone } = request.body
    // Create crypto key for AES
    // const crypto = (kit.web3.utils.randomHex(keySize)).replace('0x', '')

    // Create random seed for wallet
    const randomSeed = (kit.web3.utils.randomHex(keySize)).replace('0x', '')
    debugControllers('random seed:', randomSeed)

    // Create wallet
    const wallet = kit.web3.eth.accounts.wallet.create(1, randomSeed)
    const { address, privateKey } = wallet['0']
    debugControllers('private key:', privateKey)

    const privateKeys = await PrivateKey.find({ phone })
    debugControllers('PrivateKey collection result', privateKeys)
    if (privateKeys.length > 0) {
      response.error(ERROR_MESSAGES.PHONE_ALREADY_REGISTERED, 401)
    } else {
      // @todo save the key as a encrypted string
      const state = await PrivateKey.create({ privateKey, phone, address })
      const resp = { address: state.address, phone: state.phone }
      debugControllers('response to client: \n', resp)
      response.success(resp)
    }
  } catch (error) {
    debugControllers(error)
    response.error(error, 500)
  } finally {
    if (typeof kit.web3.currentProvider.stop === 'function') {
      kit.web3.currentProvider.stop()
    }
  }
}

const fetchWallet = async (request, response) => {
  const projections = {
    _id: 0, address: 1, phone: 1,
  }
  try {
    const { phone } = request.body
    const privateKey = await PrivateKey.findOne({ phone }, projections).lean()
    debugControllers('PrivateKey collection result: \n', privateKey)
    if (!privateKey) {
      response.error(ERROR_MESSAGES.WALLET_NOT_FOUND, 401)
    } else {
      response.success(privateKey)
    }
  } catch (error) {
    debugControllers(error)
    response.error(error, 500)
  }
}

const deleteWallet = async (request, response) => {
  try {
    const { phone } = request.body
    const deletedKey = await PrivateKey.findOneAndDelete({ phone }).lean()
    debugControllers('PrivateKey collection result: \n', deletedKey)
    if (!deletedKey) {
      response.error(ERROR_MESSAGES.WALLET_NOT_FOUND, 401)
    } else {
      const resp = {
        phone: deletedKey.phone,
        address: deletedKey.address,
      }
      debugControllers('response to client: \n', resp)
      response.success(resp)
    }
  } catch (error) {
    debugControllers(error)
    response.error(error, 500)
  }
}

const updateWallet = async (request, response) => {
  const kit = newKit(process.env.CELO_URL)
  try {
    const { phone } = request.body
    // Create random seed for wallet
    const randomSeed = (kit.web3.utils.randomHex(keySize)).replace('0x', '')
    debugControllers('random seed: ', randomSeed)

    // Create wallet
    const wallet = kit.web3.eth.accounts.wallet.create(1, randomSeed)

    // Encrypt and store wallet
    const { address, privateKey: newPrivateKey } = wallet['0']
    debugControllers('new private key', newPrivateKey)

    // Update wallet
    const newWallet = { address, privateKey: newPrivateKey }
    const updatedKey = await PrivateKey.findOneAndUpdate({ phone }, { $set: newWallet }).lean()
    debugControllers('updated key: \n', updatedKey)
    if (!updatedKey) {
      response.error(ERROR_MESSAGES.WALLET_NOT_FOUND, 401)
    } else {
      const resp = {
        address,
        phone: updatedKey.phone,
      }
      debugControllers('response to client:', resp)
      response.success(resp)
    }
  } catch (error) {
    debugControllers(error)
    response.error(error, 500)
  } finally {
    if (typeof kit.web3.currentProvider.stop === 'function') {
      kit.web3.currentProvider.stop()
    }
  }
}

export default {
  createWallet,
  fetchWallet,
  deleteWallet,
  updateWallet,
}
