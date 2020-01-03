import utils from 'web3-utils'
import { debugControllers, debugTest } from '../config/debug'
import usdBalance from '../helpers/get-usd-balance'
import gldBalance from '../helpers/get-gld-balance'

const getUSDBalance = async (request, response) => {
  try {
    const { address } = request.body
    debugControllers('request body: \n', request.body)
    const balance = utils.fromWei((await usdBalance(address)).toString())
    debugControllers('cUSD balance:\n', balance)
    response.success({ balance })
  } catch (error) {
    debugControllers(error)
    debugTest(error)
    response.error(error, 500)
  }
}

const getGLDBalance = async (request, response) => {
  try {
    debugControllers(request.body)
    const { address } = request.body
    const balance = utils.fromWei((await gldBalance(address)).toString())
    debugControllers('cGLD balance: \n', balance)
    response.success({ balance })
  } catch (error) {
    debugControllers(error)
    debugTest(error)
    response.error(error, 500)
  }
}
export default {
  getUSDBalance,
  getGLDBalance,
}
