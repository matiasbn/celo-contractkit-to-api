/* eslint-disable consistent-return */
import passport from 'passport'

const jwtAuth = (request, response, next) => {
  try {
    passport.authenticate('jwt', { session: false }, (error, user, info) => {
      if (error) return next(error)
      // Authentication error
      if (!user) {
        const errorMessage = info.name === 'TokenExpiredError' ? 'Expired access token' : (info.message || 'Unauthorized')

        return response.error(errorMessage, 401)
      }

      // Success
      request.logIn(user, (errorAuth) => {
        if (errorAuth) return next(errorAuth)

        return next()
      })
    })(request, response, next)
  } catch (error) {
    return response.error(error)
  }
}

export default jwtAuth
