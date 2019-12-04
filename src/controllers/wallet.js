import { newKit } from '@celo/contractkit'
import { debugControllers } from '../config/debug'
import PrivateKey from '../models/private-key'
// import Logger from '../config/logger'
const keySize = Number(process.env.KEY_SIZE)
// Create kit
const kit = newKit('https://alfajores-forno.celo-testnet.org/')
const { web3 } = kit

const createWallet = async (request, response) => {
  debugControllers(request.body)
  const { email, phone } = request.body
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

  // Clear wallets
  web3.eth.accounts.wallet.clear()
  try {
    // const privateKeyObject = {
    //   email: 'matias.barriosn@gmail.com',
    //   privateKey,
    //   phone: '+56986698242',
    // }
    const state = new PrivateKey({ email, privateKey, phone })
    await state.save()
    response.success(state)
  } catch (error) {
    response.error(error)
  }
}

export default {
  createWallet,
}
