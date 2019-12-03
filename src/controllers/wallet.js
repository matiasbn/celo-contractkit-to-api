import { newKit } from '@celo/contractkit'
import { debugControllers } from '../config/debug'
import PrivateKey from '../models/private-key'
import Logger from '../config/logger'

const createWallet = async (request, response) => {
  // const { email, phone } = request
  debugControllers(request.body)
  const keySize = Number(process.env.KEY_SIZE)
  // Create kit
  const kit = newKit('https://alfajores-forno.celo-testnet.org/')
  const { web3 } = kit

  // Create crypto key for AES
  // const crypto = (web3.utils.randomHex(keySize)).replace('0x', '')

  // Create random seed for wallet
  const randomSeed = (web3.utils.randomHex(keySize)).replace('0x', '')
  debugControllers(randomSeed)

  // Create wallet
  const wallet = web3.eth.accounts.wallet.create(1, randomSeed)

  // Encrypt and store wallet
  const { privateKey } = wallet['0']
  debugControllers(privateKey)

  response.success()
  try {
    const privateKeyObject = {
      email: 'matias.barriosn@gmail.com',
      privateKey,
      phone: '+56986698242',
    }
    const state = new PrivateKey(privateKeyObject)
    await state.save()
  } catch (error) {
    Logger.error(error)
  }
}

export default {
  createWallet,
}
