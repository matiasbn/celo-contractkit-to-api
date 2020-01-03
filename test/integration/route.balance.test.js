import path from 'path'
import utils from 'web3-utils'
import request from 'supertest'
import PrivateKey from '../../src/models/private-key'
import app from '../../src/config/express'
import ERROR_MESSAGES from '../../src/common/error-messages'
import TEST_ERROR_MESSAGES from '../common/error-messages'
import MongoClient from '../../src/config/db'
import usdBalance from '../../src/helpers/get-usd-balance'
import gldBalance from '../../src/helpers/get-gld-balance'
import { debugTest } from '../../src/config/debug'
import getTestConfig from '../helpers/get-test-options'
import Logger from '~/src/config/logger'


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

describe('cUSD balance route integration testing', () => {
  let address

  beforeEach(async () => {
    try {
      await PrivateKey.deleteMany({})
      const fundedAccount = await PrivateKey.create(funded)
      address = fundedAccount.address
    } catch (error) {
      debugTest(error)
    }
  })
  it('[route/balance/cusd/1] should throw 422 if address is not present on the request body', async () => {
    // Without address
    const res = await request(app).get('/balance/cusd').send({ })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.address).toBe(ERROR_MESSAGES.ADDRESS_IS_EMPTY)
  })

  it('[route/balance/cusd/2] should throw 422 if address does not have the correct format', async () => {
    // With badly formatted phone number
    const badAddress = `${funded.address}G`
    const hasCorrectFormat = utils.checkAddressChecksum(badAddress)
    expect(hasCorrectFormat).toBe(false)
    const res = await request(app).get('/balance/cusd').send({ address: badAddress })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.address).toBe(ERROR_MESSAGES.IS_NOT_CHECKSUM_ADDRESS)
  })

  it('[route/balance/cusd/3] should get cUSD balance correctly', async () => {
    // Should use an existing account with funds
    const res = await request(app).get('/balance/cusd').send({ address })
    const correctBalance = await usdBalance(address)
    const { balance, status, success } = res.body
    expect(balance).not.toBe('0')
    expect(status).toBe(200)
    expect(success).toBe(true)
    // should get balance in 'dollars', not in wei
    expect(balance).toBe(utils.fromWei(correctBalance.toString()))
  })
})

describe('cGLD balance route integration testing', () => {
  let phone
  let address

  beforeEach(async () => {
    await PrivateKey.deleteMany({})
    const fundedAccount = await PrivateKey.create(funded)
    phone = fundedAccount.phone
    address = fundedAccount.address
  })

  it('[route/balance/cgld/1] should throw 422 if address are not present on the request body', async () => {
    // Without address
    const res = await request(app).get('/balance/cgld').send({ })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.address).toBe(ERROR_MESSAGES.ADDRESS_IS_EMPTY)
  })

  it('[route/balance/cgld/2] should throw 422 if address does not have the correct format', async () => {
    // With badly formatted address
    const badAddress = `${funded.address}G`
    const hasCorrectFormat = utils.checkAddressChecksum(badAddress)
    expect(hasCorrectFormat).toBe(false)
    const res = await request(app).get('/balance/cgld').send({ address: badAddress })
    expect(res.body.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message.address).toBe(ERROR_MESSAGES.IS_NOT_CHECKSUM_ADDRESS)
  })

  it('[route/balance/cgld/3] should get cGLD balance correctly', async () => {
    // Should use an existing account with funds
    const res = await request(app).get('/balance/cgld').send({ address })
    const correctBalance = await gldBalance(address)
    const { balance, status, success } = res.body
    expect(balance).not.toBe('0')
    expect(status).toBe(200)
    expect(success).toBe(true)
    // should get the balance in 'dollars', not in wei
    expect(balance).toBe(utils.fromWei(correctBalance.toString()))
  })
})
