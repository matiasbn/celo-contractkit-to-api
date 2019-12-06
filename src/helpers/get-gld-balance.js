import { newKit } from '@celo/contractkit'

// Create kit
const kit = newKit(process.env.CELO_URL)


const usdBalance = async (address) => {
// cGLD and cUSD wrappers
  const stabletoken = await kit.contracts.getStableToken()
  const balance = await stabletoken.balanceOf(address)
  return balance
}

export default usdBalance
