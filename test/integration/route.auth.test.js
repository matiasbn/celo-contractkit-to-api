import path from 'path'
import axios from 'axios'
import request from 'supertest'
import User from '../../src/models/user'
import RefreshToken from '../../src/models/refresh-token'
import app from '../../src/config/express'
import ERROR_MESSAGES from '../../src/common/error-messages'
import MongoClient from '../../src/config/db'
import { debugTest } from '../../src/config/debug'
import TEST_ERROR_MESSAGES from '../common/error-messages'
import getTestConfig from '../helpers/get-test-options'
import Logger from '~/src/config/logger'
import auth from '../../src/controllers/auth'

const authUser = {
  name: 'BfXYvwiIRkMpzAljFjJi',
  password: 'fXwh61WPBJeQIRzK8EbQ',
}

const createPayload = {
  name: authUser.name,
  password: authUser.password,
  secret: process.env.CREATE_SECRET,
}

describe('auth route', () => {
  let accessToken
  let refreshToken
  let baseURL

  beforeAll(async () => {
    try {
      const testOptions = getTestConfig(path.basename(__filename))
      if (!testOptions) {
        Logger.error(TEST_ERROR_MESSAGES.NO_TEST_CONFIG_FOUND)
      }
      await new MongoClient(testOptions).getInstance(app)
      baseURL = `http://localhost:${testOptions.appPort}`
      // Create authorized user
      await axios.post('/auth/create', createPayload, { baseURL })
    } catch (error) {
      debugTest(error)
    }
  })

  beforeEach(async () => {
    // Set the access token
    const token = await axios.post('/auth/login', authUser, { baseURL })
    accessToken = token.data.accessToken
    refreshToken = token.data.refreshToken
  })

  describe('login integration testing', () => {
    it('[route/auth/login/1] should throw 422 if any parameter of the body are not present', async () => {
      // Without name
      let body = {
        // name: authUser.name,
        password: authUser.password,
      }
      let res = await request(app).post('/auth/login').send(body)
      debugTest('[route/auth/login/1/without_name]\n', res.body)
      expect(res.body.message.name).toBe(ERROR_MESSAGES.NAME_IS_EMPTY)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)

      // Without password
      body = {
        name: authUser.name,
        // password: authUser.password,
      }
      res = await request(app).post('/auth/login').send(body)
      debugTest('[route/auth/login/1/without_password]\n', res.body)
      expect(res.body.message.password).toBe(ERROR_MESSAGES.PASSWORD_IS_EMPTY)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
    })

    it('[route/auth/login/2] should throw 401 if name or pasword is incorrect', async () => {
      // With bad name
      let body = {
        name: `${authUser.name}X`,
        password: authUser.password,
      }
      let res = await request(app).post('/auth/login').send(body)
      debugTest('[route/auth/login/2/bad_name]\n', res.body)
      expect(res.body.message).toBe(ERROR_MESSAGES.INCORRECT_NAME_OR_PASSWORD)
      expect(res.body.status).toBe(401)
      expect(res.body.success).toBe(false)

      // With bad password
      body = {
        name: authUser.name,
        password: `${authUser.password}X`,
      }
      res = await request(app).post('/auth/login').send(body)
      debugTest('[route/auth/login/2/bad_password]\n', res.body)
      expect(res.body.message).toBe(ERROR_MESSAGES.INCORRECT_NAME_OR_PASSWORD)
      expect(res.body.status).toBe(401)
      expect(res.body.success).toBe(false)
    })

    it('[route/auth/login/3] should return an object with authToken and refreshToken', async () => {
      // Correct data to login
      const body = {
        name: authUser.name,
        password: authUser.password,
      }

      const res = await request(app).post('/auth/login').send(body)
      debugTest('[route/auth/login/3]\n', res.body)
      expect(res.body.accessToken).toBeDefined()
      expect(res.body.refreshToken).toBeDefined()
      expect(res.body.tokenType).toBe('Bearer')
      expect(res.body.status).toBe(200)
      expect(res.body.success).toBe(true)
    })
  })

  describe('create user integration testing', () => {
    it('[route/auth/create/1] should throw 422 if any parameter of the body are not present', async () => {
      // Without name
      let body = {
        // name: authUser.name,
        password: authUser.password,
        secret: process.env.CREATE_SECRET,
      }
      let res = await request(app).post('/auth/create').send(body)
      debugTest('[route/auth/create/1/without_name]\n', res.body)
      expect(res.body.message.name).toBe(ERROR_MESSAGES.NAME_IS_EMPTY)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)

      // Without password
      body = {
        name: authUser.name,
        // password: authUser.password,
        secret: process.env.CREATE_SECRET,
      }
      res = await request(app).post('/auth/create').send(body)
      debugTest('[route/auth/create/1/without_password]\n', res.body)
      expect(res.body.message.password).toBe(ERROR_MESSAGES.PASSWORD_IS_EMPTY)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)

      // Without secret
      body = {
        name: authUser.name,
        password: authUser.password,
        // secret: process.env.CREATE_SECRET,
      }
      res = await request(app).post('/auth/create').send(body)
      debugTest('[route/auth/create/1/without_secret]\n', res.body)
      expect(res.body.message.secret).toBe(ERROR_MESSAGES.SECRET_IS_EMPTY)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
    })

    it('[route/auth/create/2] should throw 401 if secret is incorrect', async () => {
      // With bad name
      const body = {
        name: authUser.name,
        password: authUser.password,
        secret: `${process.env.CREATE_SECRET}X`,
      }
      const res = await request(app).post('/auth/create').send(body)
      debugTest('[route/auth/create/2]\n', res.body)
      expect(res.body.message).toBe(ERROR_MESSAGES.INCORRECT_SECRET)
      expect(res.body.status).toBe(401)
      expect(res.body.success).toBe(false)
    })

    it('[route/auth/create/3] should throw 401 if trying to register an already registered user', async () => {
      // Try to create a user with same credentials as authUser
      const body = {
        name: authUser.name,
        password: authUser.password,
        secret: process.env.CREATE_SECRET,
      }

      const res = await request(app).post('/auth/create').send(body)
      debugTest('[route/auth/create/3]\n', res.body)
      expect(res.body.message).toBe(ERROR_MESSAGES.USER_ALREADY_EXISTS)
      expect(res.body.status).toBe(401)
      expect(res.body.success).toBe(false)
    })

    it('[route/auth/create/4] should return an object with id of the user and name and store it correctly', async () => {
      // Correct data to create
      const body = {
        name: `${authUser.name}X`,
        password: `${authUser.password}X`,
        secret: process.env.CREATE_SECRET,
      }

      const res = await request(app).post('/auth/create').send(body)
      debugTest('[route/auth/create/4]\n', res.body)
      expect(res.body.id).toBeDefined()
      expect(res.body.name).toBe(body.name)
      expect(res.body.status).toBe(200)
      expect(res.body.success).toBe(true)
      // Check if name and password are correctly stored
      const { id } = res.body
      const storedUser = await User.findById(id)
      const verifyPassword = await storedUser.verifyPassword(body.password)
      expect(storedUser.name).toBe(body.name)
      expect(verifyPassword).toBe(true)
    })
  })

  describe('refresh token integration testing', () => {
    it('[route/auth/refresh/1] should throw 422 if refreshToken field is not present on the body', async () => {
      // Without refreshToken
      const body = { /** refreshToken */ }
      const res = await request(app).post('/auth/refresh').send(body)
      debugTest('[route/auth/refresh/1]\n', res.body)
      expect(res.body.message.refreshToken).toBe(ERROR_MESSAGES.REFRESH_TOKEN_IS_EMPTY)
      expect(res.body.status).toBe(422)
      expect(res.body.success).toBe(false)
    })

    it('[route/auth/refresh/2] should throw 401 if refreshToken is invalid', async () => {
      // With bad refreshToken
      const body = { refreshToken: `${refreshToken}X` }
      const res = await request(app).post('/auth/refresh').send(body)
      debugTest('[route/auth/refresh/2]\n', res.body)
      expect(res.body.message).toBe(ERROR_MESSAGES.REFRESH_TOKEN_IS_INVALID)
      expect(res.body.status).toBe(401)
      expect(res.body.success).toBe(false)
    })

    it('[route/auth/refresh/3] should throw 401 if refreshToken was revoked', async () => {
      // First revoke token
      const set = { $set: { revoked: true } }
      const options = { returnOriginal: false }
      const updatedToken = await RefreshToken.findOneAndUpdate({ refreshToken }, set, options)
      expect(updatedToken).not.toBe(null)
      expect(updatedToken.revoked).toBe(true)
      // Try to use the refreshToken
      const body = { refreshToken }
      const res = await request(app).post('/auth/refresh').send(body)
      debugTest('[route/auth/refresh/3]\n', res.body)
      expect(res.body.message).toBe(ERROR_MESSAGES.REFRESH_TOKEN_IS_REVOKED)
      expect(res.body.status).toBe(401)
      expect(res.body.success).toBe(false)
    })

    it('[route/auth/refresh/4] should return an object with the new accessToken, refreshToken and tokenType', async () => {
      // Correct data to create
      const body = { refreshToken }
      const res = await request(app).post('/auth/refresh').send(body)
      debugTest('[route/auth/refresh/4]\n', res.body)
      expect(res.body.accessToken).toBeDefined()
      expect(res.body.refreshToken).toBeDefined()
      expect(res.body.accessToken).not.toBe(accessToken)
      expect(res.body.refreshToken).not.toBe(refreshToken)
      expect(res.body.tokenType).toBe('Bearer')
      expect(res.body.status).toBe(200)
      expect(res.body.success).toBe(true)
    })
  })

  describe('delete user integration testing', () => {
    it('[route/auth/delete/1] should throw 401 if accesToken is not provided', async () => {
      // With empty body
      const res = await request(app).post('/auth/delete').send()
      debugTest('[route/auth/delete/1]\n', res.body)
      expect(res.body.message).toBe(ERROR_MESSAGES.NO_AUTH_TOKEN)
      expect(res.body.status).toBe(401)
      expect(res.body.success).toBe(false)
    })

    it('[route/auth/delete/2] should delete the user using only the access token', async () => {
      try {
        const payload = {
          name: 'aaaa',
          password: 'bbbb',
          secret: process.env.CREATE_SECRET,
        }
        // Create user to be deleted
        await request(app).post('/auth/create').send(payload)
        // Get token for user created
        const token = await request(app).post('/auth/login').send(payload)
        const accessToken2 = token.body.accessToken
        let storedUser = await User.findOne({ name: payload.name })
        expect(storedUser).not.toBe(null)
        // With empty body
        const res = await request(app).post('/auth/delete').set('Authorization', `Bearer ${accessToken2}`).send()
        debugTest('[route/auth/delete/2]\n', res.body)
        expect(res.body.id).toBe(storedUser.id)
        expect(res.body.name).toBe(storedUser.name)
        expect(res.body.status).toBe(200)
        expect(res.body.success).toBe(true)

        // Look up on the database
        storedUser = await User.findOne({ name: payload.name })
        expect(storedUser).toBe(null)
      } catch (error) {
        debugTest(error)
      }
    })
  })
})
