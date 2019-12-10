import { newKit } from '@celo/contractkit'
import debugTest from '../../src/config/debug'
import Controller from '../../src/controllers/balance'
import Wallet from '../../src/controllers/wallet'
import PrivateKey from '../../src/models/private-key'
import ERROR_MESSAGES from '../../src/common/error-messages'
import mockRequest from '../helpers/mock-request'
import mockResponse from '../helpers/mock-response'
import MongoClient from '../../src/config/db'
import usdBalance from '../../src/helpers/get-usd-balance'
import gldBalance from '../../src/helpers/get-gld-balance'

// Connect to database
// setup database name to connect to different databases per test on mongo
const options = { databaseName: 'test-controller-balance' }
new MongoClient(options).getInstance()

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
const phone = '+56986673341'
let req
let res
let emptyWallet

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
      let balance = await usdBalance(emptyWallet.address)
      let stringBalance = balance.toString()
      await Controller.getUSDBalance(req, res)
      let response = res.success.mock.calls[0]
      let balanceController = response[0].balance.toString()
      expect(stringBalance).toBe(balanceController)

      // try with funded wallet
      req = mockRequest({ body: { email: funded.email, phone: funded.phone } })
      res = mockResponse()
      balance = await usdBalance(funded.address)
      stringBalance = balance.toString()
      await Controller.getUSDBalance(req, res)
      // eslint-disable-next-line prefer-destructuring
      response = res.success.mock.calls[0]
      balanceController = response[0].balance.toString()
      expect(stringBalance).toBe(balanceController)
    })

    it('should return 401 if there is no private key for email-phone pair', async () => {
      // try with wrong email
      req = mockRequest({ body: { email: 'email.falso@gmail.com', phone } })
      res = mockResponse()
      await Controller.getUSDBalance(req, res)
      let response = res.error.mock.calls[0]
      expect(response[1]).toBe(401)
      expect(response[0]).toBe(ERROR_MESSAGES.PRIVATE_KEY_NOT_FOUND)
      // try with wrong phone
      req = mockRequest({ body: { email, phone: '+56986698244' } })
      res = mockResponse()
      await Controller.getUSDBalance(req, res)
      response = res.error.mock.calls[0]
      expect(response[1]).toBe(401)
      expect(response[0]).toBe(ERROR_MESSAGES.PRIVATE_KEY_NOT_FOUND)
      response = 0
    })
  })

  describe('cGLD unit tests', () => {
    it('should get the balance correctly', async () => {
      // try with empty wallet
      let balance = await gldBalance(emptyWallet.address)
      let stringBalance = balance.toString()
      await Controller.getGLDBalance(req, res)
      let response = res.success.mock.calls[0]
      let balanceController = response[0].balance.toString()
      expect(stringBalance).toBe(balanceController)

      // try with funded wallet
      req = mockRequest({ body: { email: funded.email, phone: funded.phone } })
      res = mockResponse()
      balance = await gldBalance(funded.address)
      stringBalance = balance.toString()
      await Controller.getGLDBalance(req, res)
      // eslint-disable-next-line prefer-destructuring
      response = res.success.mock.calls[0]
      balanceController = response[0].balance.toString()
      expect(stringBalance).toBe(balanceController)
    })

    it('should return 401 if there is no private key for email-phone pair', async () => {
      // try with wrong email
      req = mockRequest({ body: { email: 'email.falso@gmail.com', phone } })
      res = mockResponse()
      await Controller.getGLDBalance(req, res)
      let response = res.error.mock.calls[0]
      expect(response[1]).toBe(401)
      expect(response[0]).toBe(ERROR_MESSAGES.PRIVATE_KEY_NOT_FOUND)
      // try with wrong phone
      req = mockRequest({ body: { email, phone: '+56986698244' } })
      res = mockResponse()
      await Controller.getGLDBalance(req, res)
      response = res.error.mock.calls[0]
      expect(response[1]).toBe(401)
      expect(response[0]).toBe(ERROR_MESSAGES.PRIVATE_KEY_NOT_FOUND)
      response = 0
    })
  })
})
