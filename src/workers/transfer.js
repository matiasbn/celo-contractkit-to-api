/* eslint-disable max-len */
import { newKit } from '@celo/contractkit'
import { debugWorkers } from '~/src/config/debug'
import Transaction from '~/src/models/transactions'

const cUSD = (privateKey, address, toAddress, amount) => new Promise(async (resolve, reject) => {
  const kit = newKit(process.env.CELO_URL)
  try {
    // @todo watch concurrence by account to be 1
    const stableToken = await kit.contracts.getStableToken()
    const ether = kit.web3.utils.toWei(amount, 'ether')
    kit.addAccount(privateKey)
    const tx = await stableToken.transfer(toAddress, ether).send({
      from: address,
    })
    const txHash = await tx.getHash()
    // @todo check if nonce is present on this receipt
    await tx.waitReceipt()
    const transaction = await kit.web3.eth.getTransaction(txHash)
    const { nonce } = transaction
    const storedTransaction = await Transaction.create({ address, nonce, txHash })
    debugWorkers(storedTransaction)
    resolve(storedTransaction)
  } catch (error) {
    reject(error)
  } finally {
    if (typeof kit.web3.currentProvider.stop === 'function') {
      kit.web3.currentProvider.stop()
    }
  }
})


export default {
  cUSD,
}
