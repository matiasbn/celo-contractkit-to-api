import path from 'path'
import isE164 from 'is-e164-phone-number'
import request from 'supertest'
import axios from 'axios'
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

const authUser = {
  name: 'BfXYvwiIRkMpzAljFjJi',
  password: 'fXwh61WPBJeQIRzK8EbQ',
}

const createPayload = {
  name: authUser.name,
  password: authUser.password,
  secret: process.env.CREATE_SECRET,
}

describe('wallet route', () => {
  let accessToken
  let phone
  let address

  beforeAll(async () => {
    try {
      const testOptions = getTestConfig(path.basename(__filename))
      if (!testOptions) {
        Logger.error(TEST_ERROR_MESSAGES.NO_TEST_CONFIG_FOUND)
      }
      await new MongoClient(testOptions).getInstance(app)
      // Create authorized user
      await PrivateKey.deleteMany({})
      const fundedAccount = await PrivateKey.create(funded)
      phone = fundedAccount.phone
      address = fundedAccount.address
      const baseURL = `http://localhost:${testOptions.appPort}`
      await axios.post('/auth/create', createPayload, { baseURL })
      // Set the access token
      const token = await axios.post('/auth/login', authUser, { baseURL })
      accessToken = token.data.accessToken
      debugTest('accessToken', accessToken)
    } catch (error) {
      debugTest(error)
    }
  })

  afterAll(async () => {
    if (typeof kit.web3.currentProvider.stop === 'function') {
      kit.web3.currentProvider.stop()
    }
  })

  describe('create wallet integration testing', () => {
    it('[route/wallet/create/1] should throw 422 if phone is not present on the request body', async () => {
      // Without phone
      const res = await request(app).post('/wallet/create').set('Authorization', `Bearer ${accessToken}`).send({ })
      debugTest('[route/wallet/create/1]', res.body)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
      expect(res.body.message.phone).toBe(ERROR_MESSAGES.PHONE_IS_EMPTY)
    })

    it('[route/wallet/create/2] should throw 422 if phone does not have the correct format', async () => {
      // With badly formatted phone number
      const badNumber = '+569827645367381765'
      const hasCorrectFormat = isE164(badNumber)
      expect(hasCorrectFormat).toBe(false)
      const res = await request(app).post('/wallet/create').set('Authorization', `Bearer ${accessToken}`).send({ phone: badNumber })
      debugTest('[route/wallet/create/2]', res.body)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
      expect(res.body.message.phone).toBe(ERROR_MESSAGES.IS_NOT_PHONE)
    })

    it('[route/wallet/create/3] should throw 401 if phone is already registered', async () => {
      // Registered phone
      const res = await request(app).post('/wallet/create').set('Authorization', `Bearer ${accessToken}`).send({ phone })
      debugTest('[route/wallet/create/3]', res.body)
      expect(res.body.message).toBe(ERROR_MESSAGES.PHONE_ALREADY_REGISTERED)
      expect(res.body.status).toBe(401)
      expect(res.body.success).toBe(false)
    })

    it('[route/wallet/create/4] should create the wallet correctly', async () => {
      const newPhone = '+56912345678'
      const res = await request(app).post('/wallet/create').set('Authorization', `Bearer ${accessToken}`).send({ phone: newPhone })
      debugTest('[route/wallet/create/4]', res.body)
      expect(res.body.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.phone).toBe(newPhone)
      // check if is a checksum address
      expect(res.body.address).toBeDefined()
      expect(kit.web3.utils.checkAddressChecksum(res.body.address)).toBe(true)
    })
  })

  describe('fetch wallet integration testing', () => {
    it('[route/wallet/fetch/1] should throw 422 if phone is not present on the request body', async () => {
      // Without phone
      const res = await request(app).get('/wallet/fetch').set('Authorization', `Bearer ${accessToken}`).send({ })
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
      expect(res.body.message.phone).toBe(ERROR_MESSAGES.PHONE_IS_EMPTY)
    })

    it('[route/wallet/fetch/2] should throw 422 if phone does not have the correct format', async () => {
      // With badly formatted phone number
      const badNumber = '+569827645367381765'
      const hasCorrectFormat = isE164(badNumber)
      expect(hasCorrectFormat).toBe(false)
      const res = await request(app).get('/wallet/fetch').set('Authorization', `Bearer ${accessToken}`).send({ phone: badNumber })
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
      expect(res.body.message.phone).toBe(ERROR_MESSAGES.IS_NOT_PHONE)
    })

    it('[route/wallet/fetch/3] should throw 401 if phone is not found', async () => {
      // With non-existing phone
      const res = await request(app).get('/wallet/fetch').set('Authorization', `Bearer ${accessToken}`).send({ phone: '+56986698244' })
      expect(res.body.message).toBe(ERROR_MESSAGES.WALLET_NOT_FOUND)
      expect(res.body.status).toBe(401)
      expect(res.body.success).toBe(false)
    })

    it('[route/wallet/fetch/4] should fetch the wallet correctly', async () => {
      // Fetch already saved account
      const res = await request(app).get('/wallet/fetch').set('Authorization', `Bearer ${accessToken}`).send({ phone })
      expect(res.body.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.phone).toBe(phone)
      expect(res.body.address).toBe(address)
    })
  })

  describe('update wallet integration testing', () => {
    it('[route/wallet/update/1] should throw 422 if phone is not present on the request body', async () => {
      // Without phone
      const res = await request(app).post('/wallet/update').set('Authorization', `Bearer ${accessToken}`).send({ })
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
      expect(res.body.message.phone).toBe(ERROR_MESSAGES.PHONE_IS_EMPTY)
    })

    it('[route/wallet/update/2] should throw 422 if phone does not have the correct format', async () => {
      // With badly formatted phone number
      const badNumber = '+569827645367381765'
      const hasCorrectFormat = isE164(badNumber)
      expect(hasCorrectFormat).toBe(false)
      const res = await request(app).post('/wallet/update').set('Authorization', `Bearer ${accessToken}`).send({ phone: badNumber })
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
      expect(res.body.message.phone).toBe(ERROR_MESSAGES.IS_NOT_PHONE)
    })

    it('[route/wallet/update/3] should throw 401 if phone is not found', async () => {
      // With non-existing phone
      const res = await request(app).post('/wallet/update').set('Authorization', `Bearer ${accessToken}`).send({ phone: '+56986698244' })
      expect(res.body.message).toBe(ERROR_MESSAGES.WALLET_NOT_FOUND)
      expect(res.body.status).toBe(401)
      expect(res.body.success).toBe(false)
    })

    it('[route/wallet/update/4] should update the wallet correctly', async () => {
      // update already saved account
      const res = await request(app).post('/wallet/update').set('Authorization', `Bearer ${accessToken}`).send({ phone })
      expect(res.body.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.phone).toBe(phone)
      expect(res.body.address).not.toBe(address)
    })
  })

  describe('delete wallet integration testing', () => {
    it('[route/wallet/delete/1] should throw 422 if phone is not present on the request body', async () => {
      // Without phone
      const res = await request(app).post('/wallet/delete').set('Authorization', `Bearer ${accessToken}`).send({ })
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
      expect(res.body.message.phone).toBe(ERROR_MESSAGES.PHONE_IS_EMPTY)
    })

    it('[route/wallet/delete/2] should throw 422 if phone does not have the correct format', async () => {
      // With badly formatted phone number
      const badNumber = '+569827645367381765'
      const hasCorrectFormat = isE164(badNumber)
      expect(hasCorrectFormat).toBe(false)
      const res = await request(app).post('/wallet/delete').set('Authorization', `Bearer ${accessToken}`).send({ phone: badNumber })
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
      expect(res.body.message.phone).toBe(ERROR_MESSAGES.IS_NOT_PHONE)
    })

    it('[route/wallet/delete/3] should throw 401 if phone is not found', async () => {
      // With non-existing phone
      const res = await request(app).post('/wallet/delete').set('Authorization', `Bearer ${accessToken}`).send({ phone: '+56986698244' })
      expect(res.body.message).toBe(ERROR_MESSAGES.WALLET_NOT_FOUND)
      expect(res.body.status).toBe(401)
      expect(res.body.success).toBe(false)
    })

    it('[route/wallet/delete/4] should delete the wallet correctly', async () => {
      // Get stored address to compare with deleted address
      const { body } = await request(app).get('/wallet/fetch').set('Authorization', `Bearer ${accessToken}`).send({ phone })
      const fetchAddress = body.address
      // delete already saved account
      const res = await request(app).post('/wallet/delete').set('Authorization', `Bearer ${accessToken}`).send({ phone })
      expect(res.body.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.phone).toBe(phone)
      expect(res.body.address).toBe(fetchAddress)
    })
  })

  describe('authorized routes testing', () => {
    it('[route/wallet/auth] should not be capable of calling any route without an accessToken', async () => {
      // Calling routes without the 'set' option to set the Authorization header
      let res = await request(app).post('/wallet/create').send({ phone })
      debugTest('[route/wallet/auth/create]\n', res.body)
      expect(res.body.message).toBe(ERROR_MESSAGES.NO_AUTH_TOKEN)
      expect(res.body.success).toBe(false)
      expect(res.body.status).toBe(401)
      res = await request(app).post('/wallet/fetch').send({ phone })
      debugTest('[route/wallet/auth/fetch]\n', res.body)
      expect(res.body.message).toBe(ERROR_MESSAGES.NO_AUTH_TOKEN)
      expect(res.body.success).toBe(false)
      expect(res.body.status).toBe(401)
      res = await request(app).post('/wallet/update').send({ phone })
      debugTest('[route/wallet/auth/update]\n', res.body)
      expect(res.body.message).toBe(ERROR_MESSAGES.NO_AUTH_TOKEN)
      expect(res.body.success).toBe(false)
      expect(res.body.status).toBe(401)
      res = await request(app).post('/wallet/delete').send({ phone })
      debugTest('[route/wallet/auth/delete]\n', res.body)
      expect(res.body.message).toBe(ERROR_MESSAGES.NO_AUTH_TOKEN)
      expect(res.body.success).toBe(false)
      expect(res.body.status).toBe(401)
    })
  })
})
