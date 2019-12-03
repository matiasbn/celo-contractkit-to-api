
import './config/env'
import { newKit } from '@celo/contractkit'
import initDB from './config/db'

const keySize = 32

// Start database connection
initDB()

// Create wallet
const kit = newKit('https://alfajores-forno.celo-testnet.org/')
const { web3 } = kit

// Create crypto key for AES
// const crypto = (web3.utils.randomHex(keySize)).replace('0x', '')

// Create random seed for wallet
const randomSeed = (web3.utils.randomHex(keySize)).replace('0x', '')

// Create wallet
const wallet = web3.eth.accounts.wallet.create(1, randomSeed)

// Encrypt and store wallet
const { privateKey } = wallet['0']
