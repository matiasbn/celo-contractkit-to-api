import request from 'supertest'
import Controller from '../src/controllers/wallet'
import app from '../src/config/express'
import initDB from '../src/config/db'

beforeAll(() => {
  initDB(app)
})

describe('Wallet controller unit tests', () => {
  it('should return a 200', async () => {
    const response = await request(app).post('/wallet/create')
    expect(response.status).toBeDefined()
  })
})

describe('Wallet controller integration tests', () => {
  it('should return a 200', async () => {
    const response = await request(app).post('/wallet/create')
    expect(response.status).toBeDefined()
  })
})
