/* eslint-disable consistent-return */
import { newKit } from '@celo/contractkit'
import Logger from '../config/logger'

// Create kit


const gldBalance = async (address) => {
  const kit = newKit(process.env.CELO_URL)
  try {
    // cGLD and cUSD wrappers
    const goldToken = await kit.contracts.getGoldToken()
    const balance = await goldToken.balanceOf(address)
    return balance
  } catch (error) {
    Logger.error(error)
  } finally {
    if (typeof kit.web3.currentProvider.stop === 'function') {
      kit.web3.currentProvider.stop()
    }
  }
}

export default gldBalance
