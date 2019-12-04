import request from 'supertest'
import appRootPath from 'app-root-path'
import dotenv from 'dotenv'
import Controller from '../src/controllers/wallet'
import app from '../src/config/express'
import initDB from '../src/config/db'

beforeAll(() => {
  initDB(app)
})

describe('Testing wallet controller', () => {
  dotenv.config({ path: `${appRootPath.path}/test/.env` })
  it('should return a 200', async () => {
    const response = await request(app).post('/wallet/create')
    expect(response.status).toBeDefined()
  })
})
