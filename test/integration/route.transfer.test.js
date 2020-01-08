import path from 'path'
import axios from 'axios'
import isDecimal from 'validator/lib/isDecimal'
import request from 'supertest'
import { newKit } from '@celo/contractkit'
import PrivateKey from '../../src/models/private-key'
import app from '../../src/config/express'
import ERROR_MESSAGES from '../../src/common/error-messages'
import MongoClient from '../../src/config/db'
import { debugTest } from '../../src/config/debug'
import TEST_ERROR_MESSAGES from '../common/error-messages'
import getTestConfig from '../helpers/get-test-options'
import Logger from '~/src/config/logger'

const kit = newKit(process.env.CELO_URL)
const funded = {
  phone: '+56986698243',
  address: '0x6a0ebFF8C9154aB69631B86234374aE952a66032',
  privateKey: '0xb4f5a86d5e7327c8b1a7b33d63324f0e7d6005626882d67cb1e3a5812f9ba0b8',
}

const empty = {
  phone: '+56986698242',
  address: '0xE070b54B12981b325cDC804e2b35B45C8E8d429B',
  privateKey: '0x2300099e8ccac87544707cff13ea448fd03a22274f732836a056bc59aebab4c6',
}

// Existing account, with private key stored to not lose funds
const receiverAddress = '0xe17f5f0bF39c1242D1Cb5c1D0f2dC34131B7377E'

const authUser = {
  name: 'BfXYvwiIRkMpzAljFjJi',
  password: 'fXwh61WPBJeQIRzK8EbQ',
}

const createPayload = {
  name: authUser.name,
  password: authUser.password,
  secret: process.env.CREATE_SECRET,
}

describe('transfer route', () => {
  let emptyAccount
  let fundedAccount
  let accessToken

  beforeAll(async () => {
    try {
      const testOptions = getTestConfig(path.basename(__filename))
      if (!testOptions) {
        Logger.error(TEST_ERROR_MESSAGES.NO_TEST_CONFIG_FOUND)
      }
      await new MongoClient(testOptions).getInstance(app)
      await PrivateKey.deleteMany({})
      fundedAccount = await PrivateKey.create(funded)
      emptyAccount = await PrivateKey.create(empty)
      const baseURL = `http://localhost:${testOptions.appPort}`
      await axios.post('/auth/create', createPayload, { baseURL })
      // Set the access token
      const token = await axios.post('/auth/login', authUser, { baseURL })
      accessToken = token.data.accessToken
      debugTest('accessToken:\n', accessToken)
    } catch (error) {
      debugTest(error)
    }
  })

  afterAll(async () => {
    if (typeof kit.web3.currentProvider.stop === 'function') {
      kit.web3.currentProvider.stop()
    }
  })

  describe('transfer cUSD integration testing', () => {
    it('[route/transfer/cusd/1] should throw 422 if any parameter of the body is not present', async () => {
      // Without address
      let body = {
        // address: fundedAccount.address,
        toAddress: emptyAccount.address,
        amount: '0.001',
      }
      let res = await request(app).post('/transfer/cusd').set('Authorization', `Bearer ${accessToken}`).send(body)
      expect(res.body.message.address).toBe(ERROR_MESSAGES.ADDRESS_IS_EMPTY)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)

      // Without toAddress
      body = {
        address: fundedAccount.address,
        // toAddress: emptyAccount.address,
        amount: '0.001',
      }
      res = await request(app).post('/transfer/cusd').set('Authorization', `Bearer ${accessToken}`).send(body)
      expect(res.body.message.toAddress).toBe(ERROR_MESSAGES.TO_ADDRESS_IS_EMPTY)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)

      // Without amount
      body = {
        address: fundedAccount.address,
        toAddress: emptyAccount.address,
        // amount: '0.001',
      }
      res = await request(app).post('/transfer/cusd').set('Authorization', `Bearer ${accessToken}`).send(body)
      expect(res.body.message.amount).toBe(ERROR_MESSAGES.AMOUNT_IS_EMPTY)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
    })

    it('[route/transfer/cusd/2] should throw 422 if any parameter is incorrect', async () => {
      let body = {
        address: fundedAccount.address, // G is not an accepted character
        toAddress: emptyAccount.address,
        amount: '0.001',
      }

      // With badly formatted address
      body = {
        address: `${fundedAccount.address}G`, // G is not an accepted character
        toAddress: emptyAccount.address,
        amount: '0.001',
      }
      let hasCorrectFormat = kit.web3.utils.checkAddressChecksum(body.address)
      expect(hasCorrectFormat).toBe(false)
      let res = await request(app).post('/transfer/cusd').set('Authorization', `Bearer ${accessToken}`).send(body)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
      expect(res.body.message.address).toBe(ERROR_MESSAGES.IS_NOT_CHECKSUM_ADDRESS)

      // With badly formatted toAddress
      body = {
        address: fundedAccount.address,
        toAddress: `${emptyAccount.address}G`, // G is not an accepted character
        amount: '0.001',
      }
      hasCorrectFormat = kit.web3.utils.checkAddressChecksum(body.toAddress)
      expect(hasCorrectFormat).toBe(false)
      res = await request(app).post('/transfer/cusd').set('Authorization', `Bearer ${accessToken}`).send(body)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
      expect(res.body.message.toAddress).toBe(ERROR_MESSAGES.IS_NOT_CHECKSUM_ADDRESS)

      // With badly formatted amount
      body = {
        phone: fundedAccount.phone,
        toAddress: emptyAccount.address,
        amount: '0,001', // comma (,) is not accepted, it must be a dot (.)
      }
      hasCorrectFormat = isDecimal(body.amount)
      expect(hasCorrectFormat).toBe(false)
      res = await request(app).post('/transfer/cusd').set('Authorization', `Bearer ${accessToken}`).send(body)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
      expect(res.body.message.amount).toBe(ERROR_MESSAGES.AMOUNT_IS_NOT_NUMBER)
    })

    it('[route/transfer/cusd/3] should throw 401 if address is not found', async () => {
      const body = {
        address: receiverAddress, // receiver address is not stored on Mongo
        toAddress: emptyAccount.address,
        amount: '0.001',
      }
      const res2 = await request(app).post('/transfer/cusd').set('Authorization', `Bearer ${accessToken}`).send(body)
      expect(res2.body.message).toBe(ERROR_MESSAGES.WALLET_NOT_FOUND)
      expect(res2.body.status).toBe(401)
      expect(res2.body.success).toBe(false)
    })

    it('[route/transfer/cusd/4] should throw 401 if given account has not funds', async () => {
      // Empty account
      const body = {
        address: emptyAccount.address,
        toAddress: receiverAddress,
        amount: '0.001',
      }

      // With non-existing phone
      const res = await request(app).post('/transfer/cusd').set('Authorization', `Bearer ${accessToken}`).send(body)
      expect(res.body.message.message).toBe(ERROR_MESSAGES.INSUFFICIENT_FUNDS)
      expect(res.body.status).toBe(401)
      expect(res.body.success).toBe(false)
    })

    /**
     * @todo test cUSD transferring
     */
  })

  describe('transfer cGLD integration testing', () => {
    it('[route/transfer/cgld/1] should throw 422 if any parameter of the body is not present', async () => {
      // Without address
      let body = {
        // address: fundedAccount.address,
        toAddress: emptyAccount.address,
        amount: '0.001',
      }
      let res = await request(app).post('/transfer/cgld').set('Authorization', `Bearer ${accessToken}`).send(body)
      expect(res.body.message.address).toBe(ERROR_MESSAGES.ADDRESS_IS_EMPTY)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)

      // Without toAddress
      body = {
        address: fundedAccount.address,
        // toAddress: emptyAccount.address,
        amount: '0.001',
      }
      res = await request(app).post('/transfer/cgld').set('Authorization', `Bearer ${accessToken}`).send(body)
      expect(res.body.message.toAddress).toBe(ERROR_MESSAGES.TO_ADDRESS_IS_EMPTY)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)

      // Without amount
      body = {
        address: fundedAccount.address,
        toAddress: emptyAccount.address,
        // amount: '0.001',
      }
      res = await request(app).post('/transfer/cgld').set('Authorization', `Bearer ${accessToken}`).send(body)
      expect(res.body.message.amount).toBe(ERROR_MESSAGES.AMOUNT_IS_EMPTY)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
    })

    it('[route/transfer/cgld/2] should throw 422 if any parameter is incorrect', async () => {
      let body = {
        address: fundedAccount.address, // G is not an accepted character
        toAddress: emptyAccount.address,
        amount: '0.001',
      }

      // With badly formatted address
      body = {
        address: `${fundedAccount.address}G`, // G is not an accepted character
        toAddress: emptyAccount.address,
        amount: '0.001',
      }
      let hasCorrectFormat = kit.web3.utils.checkAddressChecksum(body.address)
      expect(hasCorrectFormat).toBe(false)
      let res = await request(app).post('/transfer/cgld').set('Authorization', `Bearer ${accessToken}`).send(body)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
      expect(res.body.message.address).toBe(ERROR_MESSAGES.IS_NOT_CHECKSUM_ADDRESS)

      // With badly formatted toAddress
      body = {
        address: fundedAccount.address,
        toAddress: `${emptyAccount.address}G`, // G is not an accepted character
        amount: '0.001',
      }
      hasCorrectFormat = kit.web3.utils.checkAddressChecksum(body.toAddress)
      expect(hasCorrectFormat).toBe(false)
      res = await request(app).post('/transfer/cgld').set('Authorization', `Bearer ${accessToken}`).send(body)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
      expect(res.body.message.toAddress).toBe(ERROR_MESSAGES.IS_NOT_CHECKSUM_ADDRESS)

      // With badly formatted amount
      body = {
        phone: fundedAccount.phone,
        toAddress: emptyAccount.address,
        amount: '0,001', // comma (,) is not accepted, it must be a dot (.)
      }
      hasCorrectFormat = isDecimal(body.amount)
      expect(hasCorrectFormat).toBe(false)
      res = await request(app).post('/transfer/cgld').set('Authorization', `Bearer ${accessToken}`).send(body)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
      expect(res.body.message.amount).toBe(ERROR_MESSAGES.AMOUNT_IS_NOT_NUMBER)
    })

    it('[route/transfer/cgld/3] should throw 401 if address is not found', async () => {
      const body = {
        address: receiverAddress, // receiver address is not stored on Mongo
        toAddress: emptyAccount.address,
        amount: '0.001',
      }
      const res2 = await request(app).post('/transfer/cgld').set('Authorization', `Bearer ${accessToken}`).send(body)
      expect(res2.body.message).toBe(ERROR_MESSAGES.WALLET_NOT_FOUND)
      expect(res2.body.status).toBe(401)
      expect(res2.body.success).toBe(false)
    })

    it('[route/transfer/cgld/4] should throw 401 if given account has not funds', async () => {
      // Empty account
      const body = {
        address: emptyAccount.address,
        toAddress: receiverAddress,
        amount: '0.001',
      }

      // With non-existing phone
      const res = await request(app).post('/transfer/cgld').set('Authorization', `Bearer ${accessToken}`).send(body)
      expect(res.body.message.message).toBe(ERROR_MESSAGES.INSUFFICIENT_FUNDS)
      expect(res.body.status).toBe(401)
      expect(res.body.success).toBe(false)
    })

    /**
     * @todo test cGLD transferring
     */
  })

  describe('authorized routes testing', () => {
    it('[route/transfer/auth] should not be capable of calling any route without an accessToken', async () => {
      const body = {
        address: fundedAccount.address,
        toAddress: emptyAccount.address,
        amount: '0.001',
      }
      // Calling routes without the 'set' option to set the Authorization header
      let res = await request(app).post('/transfer/cusd').send(body)
      debugTest('[route/transfer/auth/cusd]\n', res.body)
      expect(res.body.message).toBe(ERROR_MESSAGES.NO_AUTH_TOKEN)
      expect(res.body.success).toBe(false)
      expect(res.body.status).toBe(401)
      res = await request(app).post('/transfer/cgld').send(body)
      debugTest('[route/transfer/auth/cgld]\n', res.body)
      expect(res.body.message).toBe(ERROR_MESSAGES.NO_AUTH_TOKEN)
      expect(res.body.success).toBe(false)
      expect(res.body.status).toBe(401)
    })
  })
})
