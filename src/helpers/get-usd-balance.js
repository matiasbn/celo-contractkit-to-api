import { newKit } from '@celo/contractkit'

// Create kit
const kit = newKit(process.env.CELO_URL)


const gldBalance = async (address) => {
// cGLD and cUSD wrappers
  const goldToken = await kit.contracts.getGoldToken()
  const balance = await goldToken.balanceOf(address)
  return balance
}

export default gldBalance
