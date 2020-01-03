/* eslint-disable prefer-destructuring */
import path from 'path'
import utils from 'web3-utils'
import Controller from '../../src/controllers/balance'
import Wallet from '../../src/controllers/wallet'
import PrivateKey from '../../src/models/private-key'
import ERROR_MESSAGES from '../../src/common/error-messages'
import mockRequest from '../helpers/mock-request'
import mockResponse from '../helpers/mock-response'
import MongoClient from '../../src/config/db'
import usdBalance from '../../src/helpers/get-usd-balance'
import gldBalance from '../../src/helpers/get-gld-balance'
import TEST_ERROR_MESSAGES from '../common/error-messages'
import getTestConfig from '../helpers/get-test-options'
import Logger from '~/src/config/logger'

(async () => {
  const testOptions = getTestConfig(path.basename(__filename))
  if (!testOptions) {
    Logger.error(TEST_ERROR_MESSAGES.NO_TEST_CONFIG_FOUND)
  }
  await new MongoClient(testOptions).getInstance()
})()

// Set the funded account to be stored
const funded = {
  phone: '+56986698243',
  address: '0x6a0ebFF8C9154aB69631B86234374aE952a66032',
  privateKey:
      '0xb4f5a86d5e7327c8b1a7b33d63324f0e7d6005626882d67cb1e3a5812f9ba0b8',
}

const notStoredAddress = '0x6DC18276078F2ec692528b0A4a5562D6d4C58aBC'

const phone = '+56986673341'
let req
let res
let emptyWallet

describe('balance controller unit testing', () => {
  beforeEach(async () => {
    await PrivateKey.deleteMany({})
    req = mockRequest({ body: { phone } })
    res = mockResponse()
    await Wallet.createWallet(req, mockResponse())
    emptyWallet = await PrivateKey.findOne({ phone })
    await PrivateKey.create(funded)
  })

  describe('cUSD unit tests', () => {
    it('[controller/balance/cusd/1] should get the cUSD balance correctly', async () => {
      // try with empty wallet
      let balance = await usdBalance(emptyWallet.address)
      let stringBalance = balance.toString()
      req = mockRequest({ body: { address: emptyWallet.address } })
      await Controller.getUSDBalance(req, res)
      let response = res.success.mock.calls[0]
      let balanceController = response[0].balance.toString()
      // it should return in 'dollars', not wei
      expect(utils.fromWei(stringBalance)).toBe(balanceController)

      // try with funded wallet
      req = mockRequest({ body: { address: funded.address } })
      res = mockResponse()
      balance = await usdBalance(funded.address)
      stringBalance = balance.toString()
      await Controller.getUSDBalance(req, res)
      // eslint-disable-next-line prefer-destructuring
      response = res.success.mock.calls[0]
      // it should return in 'dollars', not wei
      balanceController = response[0].balance.toString()
      expect(utils.fromWei(stringBalance)).toBe(balanceController)
    })
  })

  describe('cGLD unit tests', () => {
    it('[controller/balance/cgld/1] should get the cGLD balance correctly', async () => {
      // try with empty wallet
      let balance = await gldBalance(emptyWallet.address)
      let stringBalance = balance.toString()
      req = mockRequest({ body: { address: emptyWallet.address } })
      await Controller.getGLDBalance(req, res)
      let response = res.success.mock.calls[0]
      let balanceController = response[0].balance.toString()
      // it should return in 'dollars', not wei
      expect(utils.fromWei(stringBalance)).toBe(balanceController)

      // try with funded wallet
      req = mockRequest({ body: { address: funded.address } })
      res = mockResponse()
      balance = await gldBalance(funded.address)
      stringBalance = balance.toString()
      await Controller.getGLDBalance(req, res)
      // eslint-disable-next-line prefer-destructuring
      response = res.success.mock.calls[0]
      balanceController = response[0].balance.toString()
      // it should return in 'dollars', not wei
      expect(utils.fromWei(stringBalance)).toBe(balanceController)
    })
  })
})
