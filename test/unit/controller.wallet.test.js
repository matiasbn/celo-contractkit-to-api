/* eslint-disable prefer-destructuring */
import path from 'path'
import Controller from '../../src/controllers/wallet'
import PrivateKey from '../../src/models/private-key'
import ERROR_MESSAGES from '../../src/common/error-messages'
import mockRequest from '../helpers/mock-request'
import mockResponse from '../helpers/mock-response'
import MongoClient from '../../src/config/db'
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

const phone = '+56986673341'
let req
let res

describe('wallet controller unit testing', () => {
  describe('createWallet unit tests', () => {
    beforeEach(async () => {
      await PrivateKey.deleteMany({})
      req = mockRequest({ body: { phone } })
      res = mockResponse()
    })

    it('should store phone on the private-key collection', async () => {
      await Controller.createWallet(req, res)
      const storedKey = await PrivateKey.findOne({ phone })
      expect(storedKey).not.toBeNull()
      expect(storedKey.phone).toBe(phone)
      expect(storedKey.privateKey).toBeDefined()
      expect(storedKey.address).toBeDefined()
    })

    it('should not store the phone number twice', async () => {
      // Store a wallet
      await Controller.createWallet(req, res)
      const storedKey = await PrivateKey.findOne({ phone })
      expect(storedKey).not.toBeNull()
      expect(storedKey.phone).toBe(phone)
      expect(storedKey.privateKey).toBeDefined()
      expect(storedKey.address).toBeDefined()
      // try with the same phone number
      res = mockResponse()
      await Controller.createWallet(req, res)
      const error = res.error.mock.calls[0]
      expect(error[0]).toBe(ERROR_MESSAGES.PHONE_ALREADY_REGISTERED)
      expect(error[1]).toBe(401)
    })

    it('should return an object with phone and address fields when registering', async () => {
      req = mockRequest({ body: { phone: '1234' } })
      res = mockResponse()
      await Controller.createWallet(req, res)
      const response = res.success.mock.calls[0][0]
      expect(response.phone).toBe('1234')
      expect(response.address).toBeDefined()
    })
  })

  describe('fetchWallet unit tests', () => {
    beforeEach(async () => {
      await PrivateKey.deleteMany({})
      req = mockRequest({ body: { phone } })
      res = mockResponse()
      await Controller.createWallet(req, res)
    })

    it('should throw 401 if private key is not present for given phone', async () => {
      // Fetch the wallet with wrong phone
      req = mockRequest({ body: { phone: '1234' } })
      await Controller.fetchWallet(req, res)
      const error = res.error.mock.calls[0]
      expect(error[0]).toBe(ERROR_MESSAGES.WALLET_NOT_FOUND)
      expect(error[1]).toBe(401)
    })

    it('should fetch an object with phone and address', async () => {
      await Controller.fetchWallet(req, res)
      const response = res.success.mock.calls[0][0]
      expect(response.phone).toBe(phone)
      expect(response.address).toBeDefined()
    })
  })

  describe('deleteWallet unit tests', () => {
    beforeEach(async () => {
      req = mockRequest({ body: { phone } })
      res = mockResponse()
      await PrivateKey.deleteMany({})
      // Create a wallet
      await Controller.createWallet(req, mockResponse())
    })


    it('should throw 401 if private key is not present for given phone', async () => {
      // Delete the wallet with wrong phone
      req = mockRequest({ body: { phone: '1234' } })
      res = mockResponse()
      await Controller.deleteWallet(req, res)
      const error = res.error.mock.calls[0]
      expect(error[0]).toBe(ERROR_MESSAGES.WALLET_NOT_FOUND)
      expect(error[1]).toBe(401)
    })

    it('should return an object with deleted phone and address', async () => {
      await Controller.deleteWallet(req, res)
      const response = res.success.mock.calls[0][0]
      expect(response.phone).toBe(phone)
      expect(response.address).toBeDefined()
    })
  })

  describe('updateWallet unit tests', () => {
    beforeEach(async () => {
      req = mockRequest({ body: { phone } })
      res = mockResponse()
      await PrivateKey.deleteMany({})
      // Create a wallet
      await Controller.createWallet(req, mockResponse())
    })

    it('should throw 401 if private key is not present for given phone', async () => {
      // Update the wallet with wrong phone
      req = mockRequest({ body: { phone: '1234' } })
      res = mockResponse()
      await Controller.updateWallet(req, res)
      const error = res.error.mock.calls[0]
      expect(error[1]).toBe(401)
      expect(error[0]).toBe(ERROR_MESSAGES.WALLET_NOT_FOUND)
    })

    it('should return an object with phone and updated address', async () => {
      const oldKey = await PrivateKey.findOne({ phone }, { _id: 0, address: 1 }).lean()
      await Controller.updateWallet(req, res)
      const response = res.success.mock.calls[0][0]
      expect(response.phone).toBe(phone)
      expect(response.address).not.toBe(oldKey.address)
      expect(response.address).toBeDefined()
    })
  })
})
