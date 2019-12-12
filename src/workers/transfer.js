/* eslint-disable max-len */
import { newKit } from '@celo/contractkit'
import { debugWorkers } from '../config/debug'
import Transaction from '../models/transactions'
import Logger from '../config/logger'

// Create kit
const kit = newKit('https://alfajores-forno.celo-testnet.org/')
const { web3 } = kit

async function cUSD(privateKey, address, toAddress, amount) {
  try {
    const stableToken = await kit.contracts.getStableToken()
    const ether = web3.utils.toWei(amount, 'ether')
    // Clean the wallets before execute transaction
    web3.eth.accounts.wallet.clear()
    kit.addAccount(privateKey)
    kit.defaultAccount = address
    const tx = await stableToken.transfer(toAddress, ether).send({
      from: address,
    })
    const txHash = await tx.getHash()
    await tx.waitReceipt()
    const transaction = await web3.eth.getTransaction(txHash)
    const { nonce } = transaction
    debugWorkers({ address, nonce, txHash })
    // Clean the wallets after execute transaction
    web3.eth.accounts.wallet.clear()
    const storedTransaction = await Transaction.create({ address, nonce, txHash })
    debugWorkers(storedTransaction)
  } catch (error) {
    Logger.error(error)
    web3.eth.accounts.wallet.clear()
  } finally {
    if (typeof kit.web3.currentProvider.stop === 'function') {
      kit.web3.currentProvider.stop()
    }
  }
}


export default {
  cUSD,
}
