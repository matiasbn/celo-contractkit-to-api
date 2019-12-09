import isE164 from 'is-e164-phone-number'
import isEmail from 'validator/lib/isEmail'
import request from 'supertest'
import PrivateKey from '../../src/models/private-key'
import app from '../../src/config/express'
import ERROR_MESSAGES from '../../src/common/error-messages'
import MongoClient from '../../src/config/db'
import usdBalance from '../../src/helpers/get-usd-balance'
import gldBalance from '../../src/helpers/get-gld-balance'
import { debugTest } from '../../src/config/debug'

const funded = {
  email: 'matias@gmail.com',
  phone: '+56986698243',
  address: '0x6a0ebFF8C9154aB69631B86234374aE952a66032',
  privateKey: '0xb4f5a86d5e7327c8b1a7b33d63324f0e7d6005626882d67cb1e3a5812f9ba0b8',
}

describe('cUSD balance route integration testing', () => {
  let email
  let phone
  let address

  beforeAll(async () => {
    try {
      // Connect to database
      // setup database name to connect to different databases per test on mongo
      const options = { databaseName: 'test-route-balance-usd', appPort: 3006 }
      await new MongoClient(options).getInstance(app)
      await PrivateKey.deleteMany({})
      const fundedAccount = new PrivateKey(funded)
      const privateKey = await fundedAccount.save()
      email = privateKey.email
      phone = privateKey.phone
      address = privateKey.address
    } catch (error) {
      debugTest(error)
    }
  })
  it('should throw 422 if email or phone are not present on the request body', async () => {
    // Without phone
    const res = await request(app).get('/balance/cusd').send({ email })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.PHONE_IS_EMPTY)

    // Without email
    const res2 = await request(app).get('/balance/cusd').send({ phone })
    expect(res2.body.status).toBe(422)
    expect(res2.body.success).toBe(false)
    expect(res2.body.message.email).toBe(ERROR_MESSAGES.EMAIL_IS_EMPTY)
  })


  it('should throw 422 if email or phone does not have the correct format', async () => {
    // With badly formatted phone number
    const badNumber = '+569827645367381765'
    let hasCorrectFormat = isE164(badNumber)
    expect(hasCorrectFormat).toBe(false)
    const res = await request(app).get('/balance/cusd').send({ email, phone: badNumber })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.IS_NOT_PHONE)

    // With badly formatted email
    const badEmail = 'matias@hola'
    hasCorrectFormat = isEmail(badEmail)
    expect(hasCorrectFormat).toBe(false)
    const res2 = await request(app).get('/balance/cusd').send({ email: badEmail, phone })
    expect(res2.body.status).toBe(422)
    expect(res2.body.success).toBe(false)
    expect(res2.body.message.email).toBe(ERROR_MESSAGES.IS_NOT_EMAIL)
  })

  it('should throw 401 if email-phone pair is not found', async () => {
    // With unexisting phone
    const res = await request(app).get('/balance/cusd').send({ email, phone: '+56986698244' })
    expect(res.body.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe(ERROR_MESSAGES.PRIVATE_KEY_NOT_FOUND)

    // With unexisting email
    const res2 = await request(app).get('/balance/cusd').send({ email: 'matias@hola.cl', phone })
    expect(res2.body.status).toBe(401)
    expect(res2.body.success).toBe(false)
    expect(res2.body.message).toBe(ERROR_MESSAGES.PRIVATE_KEY_NOT_FOUND)
  })

  it('should get cUSD balance correctly', async () => {
    // Should use an existing account with funds
    const res = await request(app).get('/balance/cusd').send({ email, phone })
    const correctBalance = await usdBalance(address)
    const { balance, status, success } = res.body
    expect(balance).not.toBe('0')
    expect(status).toBe(200)
    expect(success).toBe(true)
    expect(balance).toBe(correctBalance.toString())
  })
})

describe('cGLD balance route integration testing', () => {
  let email
  let phone
  let address

  beforeAll(async () => {
    // Connect to database
    // setup database name to connect to different databases per test on mongo
    const options = { databaseName: 'test-route-balance-gld', appPort: 3007 }
    await new MongoClient(options).getInstance(app)
    await PrivateKey.deleteMany({})
    const fundedAccount = new PrivateKey(funded)
    const privateKey = await fundedAccount.save()
    email = privateKey.email
    phone = privateKey.phone
    address = privateKey.address
  })

  it('should throw 422 if email or phone are not present on the request body', async () => {
    // Without phone
    const res = await request(app).get('/balance/cgld').send({ email })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.PHONE_IS_EMPTY)

    // Without email
    const res2 = await request(app).get('/balance/cgld').send({ phone })
    expect(res2.body.status).toBe(422)
    expect(res2.body.success).toBe(false)
    expect(res2.body.message.email).toBe(ERROR_MESSAGES.EMAIL_IS_EMPTY)
  })


  it('should throw 422 if email or phone does not have the correct format', async () => {
    // With badly formatted phone number
    const badNumber = '+569827645367381765'
    let hasCorrectFormat = isE164(badNumber)
    expect(hasCorrectFormat).toBe(false)
    const res = await request(app).get('/balance/cgld').send({ email, phone: badNumber })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.IS_NOT_PHONE)

    // With badly formatted email
    const badEmail = 'matias@hola'
    hasCorrectFormat = isEmail(badEmail)
    expect(hasCorrectFormat).toBe(false)
    const res2 = await request(app).get('/balance/cgld').send({ email: badEmail, phone })
    expect(res2.body.status).toBe(422)
    expect(res2.body.success).toBe(false)
    expect(res2.body.message.email).toBe(ERROR_MESSAGES.IS_NOT_EMAIL)
  })

  it('should throw 401 if email-phone pair is not found', async () => {
    // With non-existing phone
    const res = await request(app).get('/balance/cgld').send({ email, phone: '+56986698244' })
    expect(res.body.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe(ERROR_MESSAGES.PRIVATE_KEY_NOT_FOUND)

    // With non-existing email
    const res2 = await request(app).get('/balance/cgld').send({ email: 'matias@hola.cl', phone })
    expect(res2.body.status).toBe(401)
    expect(res2.body.success).toBe(false)
    expect(res2.body.message).toBe(ERROR_MESSAGES.PRIVATE_KEY_NOT_FOUND)
  })

  it('should get cGLD balance correctly', async () => {
    // Should use an existing account with funds
    const res = await request(app).get('/balance/cgld').send({ email, phone })
    const correctBalance = await gldBalance(address)
    const { balance, status, success } = res.body
    expect(balance).not.toBe('0')
    expect(status).toBe(200)
    expect(success).toBe(true)
    expect(balance).toBe(correctBalance.toString())
  })
})
