/* eslint-disable max-len */
import kit from '~/src/config/kit'
import { debugWorkers } from '~/src/config/debug'
import Transaction from '~/src/models/transactions'
import Logger from '~/src/config/logger'

async function cUSD(privateKey, address, toAddress, amount) {
  try {
    // Clean the wallets before execute transaction
    kit.web3.eth.accounts.wallet.clear()
    const stableToken = await kit.contracts.getStableToken()
    const ether = kit.web3.utils.toWei(amount, 'ether')
    kit.addAccount(privateKey)
    kit.defaultAccount = address
    const tx = await stableToken.transfer(toAddress, ether).send({
      from: address,
    })
    const txHash = await tx.getHash()
    await tx.waitReceipt()
    const transaction = await kit.web3.eth.getTransaction(txHash)
    const { nonce } = transaction
    debugWorkers({ address, nonce, txHash })
    // Clean the wallets after execute transaction
    kit.web3.eth.accounts.wallet.clear()
    const storedTransaction = await Transaction.create({ address, nonce, txHash })
    debugWorkers(storedTransaction)
  } catch (error) {
    Logger.error(error)
    kit.web3.eth.accounts.wallet.clear()
  } finally {
    if (typeof kit.web3.currentProvider.stop === 'function') {
      kit.web3.currentProvider.stop()
    }
  }
}


export default {
  cUSD,
}
