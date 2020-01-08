/* eslint-disable consistent-return */
import passport from 'passport'
import ERROR_MESSAGES from '../common/error-messages'

const jwtAuth = (request, response, next) => {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    try {
      if (error) return next(error)
      // Authentication error
      if (!user) {
        if (info) {
          if (info.name === 'TokenExpiredError') {
            const resp = {
              errorMessage: ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED,
              ...info.expiredAt && { expiredAt: info.expiredAt },
            }
            return response.error(resp, 401)
          }
          return response.error(info.message, 401)
        }
        return response.error(ERROR_MESSAGES.USER_NOT_FOUND, 401)
      }

      // Success
      request.logIn(user, (errorAuth) => {
        if (errorAuth) return next(errorAuth)

        return next()
      })
    } catch (err) {
      return response.error(err)
    }
  })(request, response, next)
}

export default jwtAuth
