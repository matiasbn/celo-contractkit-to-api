/* eslint-disable consistent-return */
import { newKit } from '@celo/contractkit'
import Logger from '../config/logger'
// Create kit


const usdBalance = async (address) => {
  const kit = newKit(process.env.CELO_URL)
  // cGLD and cUSD wrappers
  try {
    const stabletoken = await kit.contracts.getStableToken()
    const balance = await stabletoken.balanceOf(address)
    return balance
  } catch (error) {
    Logger(error)
  } finally {
    if (typeof kit.web3.currentProvider.stop === 'function') {
      kit.web3.currentProvider.stop()
    }
  }
}

export default usdBalance
