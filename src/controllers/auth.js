/* eslint-disable consistent-return */
/* eslint-disable max-len */
import passport from 'passport'
import utils from 'web3-utils'
import JWT from 'jsonwebtoken'
import { debugControllers, debugAuth } from '../config/debug'
import RefreshToken from '../models/refresh-token'
import User from '../models/user'
import ERROR_MESSAGES from '../common/error-messages'
import Logger from '../config/logger'

const { JWT_SECRET, JWT_EXPIRATION_TIME, KEY_SIZE } = process.env

const login = (request, response) => {
  passport.authenticate('local', { session: false }, (errorAuth, user, info) => {
    if (!errorAuth && user) {
      debugControllers('Controller::Auth::Login', user)
      request.logIn(user, { session: false }, async (errorLogin) => {
        if (!errorLogin) {
          try {
            const accessToken = JWT.sign({ userId: user._id }, JWT_SECRET, { expiresIn: `${JWT_EXPIRATION_TIME}s` })
            const refreshToken = utils.randomHex(Number(KEY_SIZE))
            const refreshTokenObject = {
              userId: user.id,
              refreshToken,
              issuedAt: Date.now(),
              revoked: false,
            }
            debugAuth('Controller::Auth::Login::refreshToken', refreshTokenObject)
            const storedToken = await RefreshToken.findOne({ userId: user._id })
            if (!storedToken) {
              await RefreshToken.create(refreshTokenObject)
            } else {
              await RefreshToken.findOneAndUpdate({ userId: user._id }, refreshTokenObject, { new: true })
            }
            const authResponse = {
              accessToken, refreshToken, token_type: 'Bearer',
            }
            return response.success(authResponse)
          } catch (error) {
            Logger.error(error)
            return response.error(error)
          }
        }
        return response.error(errorLogin)
      })
    } else {
      return response.error(info.message, 400)
    }
  })(request, response)
}

const create = async (request, response) => {
  try {
    const { name, password, secret } = request.body
    if (secret === process.env.CREATE_SECRET) {
      const storedUser = await User.findOne({ name })
      if (storedUser) {
        return response.error(ERROR_MESSAGES.USER_ALREADY_EXISTS)
      }
      const createdUser = await User.create({ name, password })
      return response.success({ id: createdUser._id, name: createdUser.name })
    }
    return response.error(ERROR_MESSAGES.INCORRECT_SECRET)
  } catch (error) {
    response.error(error, 500)
  }
}

export default {
  login,
  create,
}
