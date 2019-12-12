import path from 'path'
import web3 from 'web3-utils'
import isE164 from 'is-e164-phone-number'
import isEmail from 'validator/lib/isEmail'
import request from 'supertest'
import PrivateKey from '../../src/models/private-key'
import app from '../../src/config/express'
import ERROR_MESSAGES from '../../src/common/error-messages'
import TEST_ERROR_MESSAGES from '../common/error-messages'
import MongoClient from '../../src/config/db'
import { debugTest } from '../../src/config/debug'
import getTestConfig from '../helpers/get-test-options'
import Logger from '~/src/config/logger'

const funded = {
  email: 'matias@gmail.com',
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
  let email
  let phone

  beforeEach(async () => {
    try {
      await PrivateKey.deleteMany({})
      const fundedAccount = await PrivateKey.create(funded)
      email = fundedAccount.email
      phone = fundedAccount.phone
    } catch (error) {
      debugTest(error)
    }
  })
  it('should throw 422 if email or phone are not present on the request body', async () => {
    // Without phone
    const res = await request(app).post('/wallet/create').send({ email })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.PHONE_IS_EMPTY)

    // Without email
    const res2 = await request(app).post('/wallet/create').send({ phone })
    expect(res2.body.status).toBe(422)
    expect(res2.body.success).toBe(false)
    expect(res2.body.message.email).toBe(ERROR_MESSAGES.EMAIL_IS_EMPTY)
  })


  it('should throw 422 if email or phone does not have the correct format', async () => {
    // With badly formatted phone number
    const badNumber = '+569827645367381765'
    let hasCorrectFormat = isE164(badNumber)
    expect(hasCorrectFormat).toBe(false)
    const res = await request(app).post('/wallet/create').send({ email, phone: badNumber })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.IS_NOT_PHONE)

    // With badly formatted email
    const badEmail = 'matias@hola'
    hasCorrectFormat = isEmail(badEmail)
    expect(hasCorrectFormat).toBe(false)
    const res2 = await request(app).post('/wallet/create').send({ email: badEmail, phone })
    expect(res2.body.status).toBe(422)
    expect(res2.body.success).toBe(false)
    expect(res2.body.message.email).toBe(ERROR_MESSAGES.IS_NOT_EMAIL)
  })

  it('should throw 401 if email or phone is already registered', async () => {
    // Registered email
    const res = await request(app).post('/wallet/create').send({ email, phone: '+56986698244' })
    expect(res.body.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe(ERROR_MESSAGES.EMAIL_OR_PHONE_ALREADY_REGISTERED)

    // Registered phone
    const res2 = await request(app).post('/wallet/create').send({ email: 'matias@hola.cl', phone })
    expect(res2.body.status).toBe(401)
    expect(res2.body.success).toBe(false)
    expect(res2.body.message).toBe(ERROR_MESSAGES.EMAIL_OR_PHONE_ALREADY_REGISTERED)
  })

  it('should create the wallet correctly', async () => {
    const newEmail = 'matias@asd.cl'
    const newPhone = '+56912345678'
    const res = await request(app).post('/wallet/create').send({ email: newEmail, phone: newPhone })
    expect(res.body.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.email).toBe(newEmail)
    expect(res.body.phone).toBe(newPhone)
    // check if is a checksum address
    expect(res.body.address).toBeDefined()
    expect(web3.checkAddressChecksum(res.body.address)).toBe(true)
  })
})

describe('fetch wallet route integration testing', () => {
  let email
  let phone
  let address

  beforeEach(async () => {
    try {
      await PrivateKey.deleteMany({})
      const fundedAccount = await PrivateKey.create(funded)
      email = fundedAccount.email
      phone = fundedAccount.phone
      address = fundedAccount.address
    } catch (error) {
      debugTest(error)
    }
  })

  it('should throw 422 if email or phone are not present on the request body', async () => {
    // Without phone
    const res = await request(app).get('/wallet/fetch').send({ email })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.PHONE_IS_EMPTY)

    // Without email
    const res2 = await request(app).get('/wallet/fetch').send({ phone })
    expect(res2.body.status).toBe(422)
    expect(res2.body.success).toBe(false)
    expect(res2.body.message.email).toBe(ERROR_MESSAGES.EMAIL_IS_EMPTY)
  })


  it('should throw 422 if email or phone does not have the correct format', async () => {
    // With badly formatted phone number
    const badNumber = '+569827645367381765'
    let hasCorrectFormat = isE164(badNumber)
    expect(hasCorrectFormat).toBe(false)
    const res = await request(app).get('/wallet/fetch').send({ email, phone: badNumber })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.IS_NOT_PHONE)

    // With badly formatted email
    const badEmail = 'matias@hola'
    hasCorrectFormat = isEmail(badEmail)
    expect(hasCorrectFormat).toBe(false)
    const res2 = await request(app).get('/wallet/fetch').send({ email: badEmail, phone })
    expect(res2.body.status).toBe(422)
    expect(res2.body.success).toBe(false)
    expect(res2.body.message.email).toBe(ERROR_MESSAGES.IS_NOT_EMAIL)
  })

  it('should throw 401 if email-phone pair is not found', async () => {
    // With non-existing phone
    const res = await request(app).get('/wallet/fetch').send({ email, phone: '+56986698244' })
    expect(res.body.message).toBe(ERROR_MESSAGES.WALLET_NOT_FOUND)
    expect(res.body.status).toBe(401)
    expect(res.body.success).toBe(false)

    // With non-existing email
    const res2 = await request(app).get('/wallet/fetch').send({ email: 'matias@hola.cl', phone })
    expect(res2.body.message).toBe(ERROR_MESSAGES.WALLET_NOT_FOUND)
    expect(res2.body.status).toBe(401)
    expect(res2.body.success).toBe(false)
  })

  it('should fetch the wallet correctly', async () => {
    // Fetch already saved account
    const res = await request(app).get('/wallet/fetch').send({ email, phone })
    expect(res.body.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.email).toBe(email)
    expect(res.body.phone).toBe(phone)
    expect(res.body.address).toBe(address)
  })
})
