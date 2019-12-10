/* eslint-disable max-len */
import { newKit } from '@celo/contractkit'
import { debugControllers } from '../config/debug'
import PrivateKey from '../models/private-key'
import ERROR_MESSAGES from '../common/error-messages'

// Create kit
const kit = newKit('https://alfajores-forno.celo-testnet.org/')
const { web3 } = kit


const transferCUSD = async (request, response) => {
  // const goldtoken = await kit.contracts.getGoldToken()
  const stableToken = await kit.contracts.getStableToken()
  try {
    debugControllers(request.body)
    const {
      email, phone, toAddress,
    } = request.body
    const privKey = await PrivateKey.findOne({ email, phone }, { _id: 0, address: 1, privateKey: 1 }).lean()
    debugControllers(privKey)
    if (!privKey) {
      response.error(ERROR_MESSAGES.EMAIL_OR_PHONE_ALREADY_REGISTERED, 401)
    } else {
      const { privateKey, address } = privKey
      const resp = { privateKey, address }
      // Clean the wallets before execute transaction
      web3.eth.accounts.wallet.clear()
      kit.addAccount(privateKey)
      kit.defaultAccount = address
      const ether = kit.web3.utils.toWei('0.001', 'ether')
      const tx = await stableToken.transfer(toAddress, ether).send({
        from: address,
      })
      const hash = await tx.getHash()
      const receipt = await tx.waitReceipt()
      debugControllers('Gold Transfer. hash: %s. Receipt: %O', hash, receipt)
      // Clean the wallets after execute transaction
      web3.eth.accounts.wallet.clear()
      debugControllers(resp)
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
  transferCUSD,
}
