
import './config/env'
import { newKit } from '@celo/contractkit'
import initDB from './config/db'
import { debugWallet, debugStorage, debugApp } from './config/debug'
import PrivateKey from './models/private-key'
import Logger from './config/logger'
import app from './config/express'

const keySize = Number(process.env.KEY_SIZE)

// Start database connection
initDB(app)

// Create kit
const kit = newKit('https://alfajores-forno.celo-testnet.org/')
const { web3 } = kit

// Create crypto key for AES
// const crypto = (web3.utils.randomHex(keySize)).replace('0x', '')

// Create random seed for wallet
const randomSeed = (web3.utils.randomHex(keySize)).replace('0x', '')
debugWallet('randomseed', randomSeed)
// Create wallet
const wallet = web3.eth.accounts.wallet.create(1, randomSeed)

// Encrypt and store wallet
const { privateKey } = wallet['0']
debugWallet('privateKey', privateKey);


(async () => {
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
})()
