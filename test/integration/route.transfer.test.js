import path from 'path'
import isE164 from 'is-e164-phone-number'
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

(async () => {
  const testOptions = getTestConfig(path.basename(__filename))
  if (!testOptions) {
    Logger.error(TEST_ERROR_MESSAGES.NO_TEST_CONFIG_FOUND)
  }
  await new MongoClient(testOptions).getInstance(app)
})()

const kit = newKit(process.env.CELO_URL)
const funded = {
  phone: '+56986698243',
  address: '0x6a0ebFF8C9154aB69631B86234374aE952a66032',
  privateKey: '0xb4f5a86d5e7327c8b1a7b33d63324f0e7d6005626882d67cb1e3a5812f9ba0b8',
}

const empty = {
  privateKey: '0x4934c1976005bd28dbe97c756ef15416be91da444553d2ab1564dd8d506a7351',
  phone: '+56986698242',
  address: '0xD0aC2e3A87EB8113Ed07a5242E9F6fB9d79569b1',
}

// Existing account, with private key stored to not lose funds
const receiverAddress = '0xe17f5f0bF39c1242D1Cb5c1D0f2dC34131B7377E'

describe('transfer cUSD route integration testing', () => {
  let emptyAccount
  let fundedAccount

  beforeAll(async () => {
    try {
      await PrivateKey.deleteMany({})
      fundedAccount = await PrivateKey.create(funded)
      emptyAccount = await PrivateKey.create(empty)
    } catch (error) {
      debugTest(error)
    }
  })

  afterAll(async () => {
    if (typeof kit.web3.currentProvider.stop === 'function') {
      kit.web3.currentProvider.stop()
    }
  })
  /**
    * @description Check body parameters existence and content
    */
  it('[route/transfer/cusd/1] should throw 422 if any parameter of the body is not present', async () => {
    // Without phone
    let body = {
      // phone: fundedAccount.phone,
      toAddress: emptyAccount.address,
      amount: '0.001',
    }
    let res = await request(app).post('/transfer/cusd').send(body)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.PHONE_IS_EMPTY)
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)

    // Without toAddress
    body = {
      phone: fundedAccount.phone,
      // toAddress: emptyAccount.address,
      amount: '0.001',
    }
    res = await request(app).post('/transfer/cusd').send(body)
    expect(res.body.message.toAddress).toBe(ERROR_MESSAGES.TO_ADDRESS_IS_EMPTY)
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)

    // Without amount
    body = {
      phone: fundedAccount.phone,
      toAddress: emptyAccount.address,
      // amount: '0.001',
    }
    res = await request(app).post('/transfer/cusd').send(body)
    expect(res.body.message.amount).toBe(ERROR_MESSAGES.AMOUNT_IS_EMPTY)
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
  })
  it('[route/transfer/cusd/2] should throw 422 if any parameter is incorrect', async () => {
    let body = {
      phone: '+569827645367381765',
      toAddress: emptyAccount.address,
      amount: '0.001',
    }
    // With badly formatted phone number
    let hasCorrectFormat = isE164(body.phone)
    expect(hasCorrectFormat).toBe(false)
    let res = await request(app).post('/transfer/cusd').send(body)
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.phone).toBe(ERROR_MESSAGES.IS_NOT_PHONE)

    // With badly formatted address
    body = {
      phone: fundedAccount.phone,
      toAddress: `${emptyAccount.address}G`, // G is not an accepted character
      amount: '0.001',
    }
    hasCorrectFormat = kit.web3.utils.checkAddressChecksum(body.toAddress)
    expect(hasCorrectFormat).toBe(false)
    res = await request(app).post('/transfer/cusd').send(body)
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
    res = await request(app).post('/transfer/cusd').send(body)
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.amount).toBe(ERROR_MESSAGES.AMOUNT_IS_NOT_NUMBER)
  })

  /**
    * @description Check the controller working as expected
    */
  it('[route/transfer/cusd/3] should throw 401 if phone pair is not found', async () => {
    const body = {
      phone: '+56986698245',
      toAddress: emptyAccount.address,
      amount: '0.001',
    }
    const res2 = await request(app).post('/transfer/cusd').send(body)
    expect(res2.body.message).toBe(ERROR_MESSAGES.WALLET_NOT_FOUND)
    expect(res2.body.status).toBe(401)
    expect(res2.body.success).toBe(false)
  })

  it('[route/transfer/cusd/4] should throw 401 if given account has not funds', async () => {
    // Empty account
    const body = {
      phone: emptyAccount.phone,
      toAddress: receiverAddress,
      amount: '0.001',
    }

    // With non-existing phone
    const res = await request(app).post('/transfer/cusd').send(body)
    expect(res.body.message).toBe(ERROR_MESSAGES.INSUFFICIENT_FUNDS)
    expect(res.body.status).toBe(401)
    expect(res.body.success).toBe(false)
  })
})
