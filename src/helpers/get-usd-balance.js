import { newKit } from '@celo/contractkit'

// Create kit
const kit = newKit(process.env.CELO_URL)


const getUSDBalance = async (address) => {
// cGLD and cUSD wrappers
  const stabletoken = await kit.contracts.getStableToken()
  const usdBalance = await stabletoken.balanceOf(address)
  return usdBalance
}

export default getUSDBalance
