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
const JWT_OPTIONS = { expiresIn: `${JWT_EXPIRATION_TIME}s` }

const login = (request, response) => {
  passport.authenticate('local', { session: false }, (errorAuth, user, info) => {
    if (!errorAuth && user) {
      debugControllers('Controller::Auth::Login', user)
      request.logIn(user, { session: false }, async (errorLogin) => {
        if (!errorLogin) {
          try {
            const accessToken = JWT.sign({ userId: user._id }, JWT_SECRET, JWT_OPTIONS)
            const refreshToken = utils.randomHex(Number(KEY_SIZE)).replace('0x', '')
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
              accessToken, refreshToken, tokenType: 'Bearer',
            }
            return response.success(authResponse)
          } catch (error) {
            Logger.error(error)
            return response.error(error)
          }
        }
        return response.error(errorLogin, 401)
      })
    } else {
      return response.error(info.message, 401)
    }
  })(request, response)
}

const create = async (request, response) => {
  try {
    const { name, password, secret } = request.body
    if (secret === process.env.CREATE_SECRET) {
      const storedUser = await User.findOne({ name })
      if (storedUser) {
        return response.error(ERROR_MESSAGES.USER_ALREADY_EXISTS, 401)
      }
      const createdUser = await User.create({ name, password })
      return response.success({ id: createdUser._id, name: createdUser.name })
    }
    return response.error(ERROR_MESSAGES.INCORRECT_SECRET, 401)
  } catch (error) {
    response.error(error, 500)
  }
}
const refresh = async (request, response) => {
  try {
    const refreshToken = await RefreshToken.findOne({ refreshToken: request.body.refreshToken })

    if (!refreshToken) return response.error(ERROR_MESSAGES.REFRESH_TOKEN_IS_INVALID, 401)
    if (refreshToken.revoked) return response.error(ERROR_MESSAGES.REFRESH_TOKEN_IS_REVOKED, 401)

    const accessTokenValue = JWT.sign({ uid: refreshToken.userId }, JWT_SECRET, JWT_OPTIONS)
    const refreshTokenValue = utils.randomHex(Number(KEY_SIZE)).replace('0x', '')

    const newRefreshToken = {
      userId: refreshToken.userId,
      refreshToken: refreshTokenValue,
      revoked: false,
      issuedAt: Date.now(),
    }

    await RefreshToken.updateOne({ userId: refreshToken.userId }, newRefreshToken)

    const authResponse = {
      accessToken: accessTokenValue,
      refreshToken: refreshTokenValue,
      tokenType: 'Bearer',
    }

    return response.success(authResponse)
  } catch (error) {
    return response.error(error)
  }
}

const del = async (request, response) => {
  try {
    const { name } = request.user
    const storedUser = await User.findOne({ name })
    if (!storedUser) {
      return response.error(ERROR_MESSAGES.USER_NOT_FOUND, 401)
    }
    const deletedUser = await User.findOneAndDelete({ name })
    return response.success({ id: deletedUser._id, name: deletedUser.name })
  } catch (error) {
    response.error(error, 500)
  }
}

export default {
  login,
  create,
  refresh,
  del,
}
