import path from 'path'
import isE164 from 'is-e164-phone-number'
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
};

(async () => {
  const testOptions = getTestConfig(path.basename(__filename))
  if (!testOptions) {
    Logger.error(TEST_ERROR_MESSAGES.NO_TEST_CONFIG_FOUND)
  }
  await new MongoClient(testOptions).getInstance(app)
})()

describe('create wallet route integration testing', () => {
  let phone

  beforeEach(async () => {
    try {
      await PrivateKey.deleteMany({})
      const fundedAccount = await PrivateKey.create(funded)
      phone = fundedAccount.phone
    } catch (error) {
      debugTest(error)
    }
  })

  afterAll(async () => {
    if (typeof kit.web3.currentProvider.stop === 'function') {
      kit.web3.currentProvider.stop()
    }
  })
  it('should throw 422 if phone is not present on the request body', async () => {
    // Without phone
    const res = await request(app).post('/wallet/create').send({ })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.PHONE_IS_EMPTY)
  })

  it('should throw 422 if phone does not have the correct format', async () => {
    // With badly formatted phone number
    const badNumber = '+569827645367381765'
    const hasCorrectFormat = isE164(badNumber)
    expect(hasCorrectFormat).toBe(false)
    const res = await request(app).post('/wallet/create').send({ phone: badNumber })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.IS_NOT_PHONE)
  })

  it('should throw 401 if phone is already registered', async () => {
    // Registered phone
    const res2 = await request(app).post('/wallet/create').send({ phone })
    expect(res2.body.message).toBe(ERROR_MESSAGES.PHONE_ALREADY_REGISTERED)
    expect(res2.body.status).toBe(401)
    expect(res2.body.success).toBe(false)
  })

  it('should create the wallet correctly', async () => {
    const newPhone = '+56912345678'
    const res = await request(app).post('/wallet/create').send({ phone: newPhone })
    expect(res.body.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.phone).toBe(newPhone)
    // check if is a checksum address
    expect(res.body.address).toBeDefined()
    expect(kit.web3.utils.checkAddressChecksum(res.body.address)).toBe(true)
  })
})

describe('fetch wallet route integration testing', () => {
  let phone
  let address

  beforeEach(async () => {
    try {
      await PrivateKey.deleteMany({})
      const fundedAccount = await PrivateKey.create(funded)
      phone = fundedAccount.phone
      address = fundedAccount.address
    } catch (error) {
      debugTest(error)
    }
  })

  it('should throw 422 if phone is not present on the request body', async () => {
    // Without phone
    const res = await request(app).get('/wallet/fetch').send({ })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.PHONE_IS_EMPTY)
  })

  it('should throw 422 if phone does not have the correct format', async () => {
    // With badly formatted phone number
    const badNumber = '+569827645367381765'
    const hasCorrectFormat = isE164(badNumber)
    expect(hasCorrectFormat).toBe(false)
    const res = await request(app).get('/wallet/fetch').send({ phone: badNumber })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.IS_NOT_PHONE)
  })

  it('should throw 401 if phone is not found', async () => {
    // With non-existing phone
    const res = await request(app).get('/wallet/fetch').send({ phone: '+56986698244' })
    expect(res.body.message).toBe(ERROR_MESSAGES.WALLET_NOT_FOUND)
    expect(res.body.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  it('should fetch the wallet correctly', async () => {
    // Fetch already saved account
    const res = await request(app).get('/wallet/fetch').send({ phone })
    expect(res.body.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.phone).toBe(phone)
    expect(res.body.address).toBe(address)
  })
})

describe('delete wallet route integration testing', () => {
  let phone
  let address

  beforeEach(async () => {
    try {
      await PrivateKey.deleteMany({})
      const fundedAccount = await PrivateKey.create(funded)
      phone = fundedAccount.phone
      address = fundedAccount.address
    } catch (error) {
      debugTest(error)
    }
  })

  it('should throw 422 if phone is not present on the request body', async () => {
    // Without phone
    const res = await request(app).post('/wallet/delete').send({ })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.PHONE_IS_EMPTY)
  })

  it('should throw 422 if phone does not have the correct format', async () => {
    // With badly formatted phone number
    const badNumber = '+569827645367381765'
    const hasCorrectFormat = isE164(badNumber)
    expect(hasCorrectFormat).toBe(false)
    const res = await request(app).post('/wallet/delete').send({ phone: badNumber })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.IS_NOT_PHONE)
  })

  it('should throw 401 if phone is not found', async () => {
    // With non-existing phone
    const res = await request(app).post('/wallet/delete').send({ phone: '+56986698244' })
    expect(res.body.message).toBe(ERROR_MESSAGES.WALLET_NOT_FOUND)
    expect(res.body.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  it('should delete the wallet correctly', async () => {
    // delete already saved account
    const res = await request(app).post('/wallet/delete').send({ phone })
    expect(res.body.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.phone).toBe(phone)
    expect(res.body.address).toBe(address)
  })
})

describe('update wallet route integration testing', () => {
  let phone
  let address

  beforeEach(async () => {
    try {
      await PrivateKey.deleteMany({})
      const fundedAccount = await PrivateKey.create(funded)
      phone = fundedAccount.phone
      address = fundedAccount.address
    } catch (error) {
      debugTest(error)
    }
  })

  it('should throw 422 if phone is not present on the request body', async () => {
    // Without phone
    const res = await request(app).post('/wallet/update').send({ })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.PHONE_IS_EMPTY)
  })

  it('should throw 422 if phone does not have the correct format', async () => {
    // With badly formatted phone number
    const badNumber = '+569827645367381765'
    const hasCorrectFormat = isE164(badNumber)
    expect(hasCorrectFormat).toBe(false)
    const res = await request(app).post('/wallet/update').send({ phone: badNumber })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.IS_NOT_PHONE)
  })

  it('should throw 401 if phone is not found', async () => {
    // With non-existing phone
    const res = await request(app).post('/wallet/update').send({ phone: '+56986698244' })
    expect(res.body.message).toBe(ERROR_MESSAGES.WALLET_NOT_FOUND)
    expect(res.body.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  it('should update the wallet correctly', async () => {
    // update already saved account
    const res = await request(app).post('/wallet/update').send({ phone })
    expect(res.body.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.phone).toBe(phone)
    expect(res.body.address).not.toBe(address)
  })
})
