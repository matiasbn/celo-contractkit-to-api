import { CeloContract, newKit } from '@celo/contractkit'
import debugTest from '../../src/config/debug'
import Controller from '../../src/controllers/balance'
import Wallet from '../../src/controllers/wallet'
import PrivateKey from '../../src/models/private-key'
import ERROR_MESSAGES from '../../src/common/error-messages'
import mockRequest from '../helpers/mock-request'
import mockResponse from '../helpers/mock-response'
import MongoClient from '../../src/config/db'
import getUSDBalance from '../../src/helpers/get-usd-balance'

// Connect to database
// setup database name to connect to different databases per test on mongo
new MongoClient('test-controller-balance').getInstance()


// Set the kit
const kit = newKit(process.env.CELO_URL)
const { web3 } = kit

// Set the funded account to be stored
const funded = {
  email: 'matias@gmail.com',
  phone: '+56986698243',
  address: '0x6a0ebFF8C9154aB69631B86234374aE952a66032',
  privateKey:
      '0xb4f5a86d5e7327c8b1a7b33d63324f0e7d6005626882d67cb1e3a5812f9ba0b8',
}
const fundedAccount = new PrivateKey(funded)

const email = 'matias.barriosn@gmail.com'
const phone = '+56986698242'
let req
let res
let emptyWallet
let goldtoken
let stabletoken

describe('balance controller unit testing', () => {
  beforeAll(async () => {
    await PrivateKey.deleteMany({})
    req = mockRequest({ body: { email, phone } })
    res = mockResponse()
    await Wallet.createWallet(req, res)
    emptyWallet = await PrivateKey.findOne({ email, phone })
    await fundedAccount.save()
  })

  beforeEach(async () => {
    req = mockRequest({ body: { email, phone } })
    res = mockResponse()
  })

  describe('cUSD unit tests', () => {
    it('should get the balance correctly', async () => {
      // try with empty wallet
      let balance = await getUSDBalance(emptyWallet.address)
      let stringBalance = balance.toString()
      await Controller.getBalance(req, res)
      let response = res.success.mock.calls[0]
      let balanceController = response[0].balance.toString()
      expect(stringBalance).toBe(balanceController)

      // try with funded wallet
      req = mockRequest({ body: { email: funded.email, phone: funded.phone } })
      res = mockResponse()
      balance = await getUSDBalance(funded.address)
      stringBalance = balance.toString()
      await Controller.getBalance(req, res)
      // eslint-disable-next-line prefer-destructuring
      response = res.success.mock.calls[0]
      balanceController = response[0].balance.toString()
      expect(stringBalance).toBe(balanceController)
    })
  })
})
