import request from 'supertest'
import expectExport from 'expect'
import PrivateKey from '../../src/models/private-key'
import app from '../../src/config/express'
import ERROR_MESSAGES from '../../src/common/error-messages'
import MongoClient from '../../src/config/db'
import mockRequest from '../helpers/mock-request'
import mockResponse from '../helpers/mock-response'
import Wallet from '../../src/controllers/wallet'


// Connect to database
// setup database name to connect to different databases per test on mongo

const email = 'matias.barriosn@gmail.com'
const phone = '+56986698242'
let privateKey
describe('balance route integration testing', () => {
  beforeAll(async () => {
    const options = { databaseName: 'test-route-balance', appPort: 3006 }
    await new MongoClient(options).getInstance(app)
    const req = mockRequest({ body: { email, phone } })
    const res = mockResponse()
    await Wallet.createWallet(req, res)
    privateKey = await PrivateKey.findOne({ email, phone }).lean()
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
})
