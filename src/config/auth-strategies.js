/* eslint-disable max-len */
import A2A from 'a2a'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

import User from '../models/user'
import { debugAuth } from './debug'

const localOptions = {
  usernameField: 'name',
  passReqToCallback: true,
}

passport.use(new LocalStrategy(localOptions, async (request, name, password, done) => {
  debugAuth('Auth::Local::name', name)
  debugAuth('Auth::Local::password', password)
  const [error, user] = await A2A(User.findOne({ name }))

  if (!error) {
    if (!user) return done(null, false, { message: 'Incorrect email or password' })

    const [errorVerification, isMatch] = await A2A(user.verifyPassword(password))

    if (errorVerification || !isMatch) {
      return done(null, false, new Error('Incorrect email or password'))
    }

    return done(null, user)
  }

  return done(error)
}))

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
}

passport.use(new JwtStrategy(jwtOptions, async (request, payload, done) => {
  debugAuth('jwt payload', payload)
  const [error, user] = await A2A(User.findById(payload.userId))

  if (!error) {
    if (!user) return done(null, false)

    return done(null, user)
  }

  return done(error, false)
}))

passport.serializeUser((user, done) => {
  delete user.password

  done(null, user)
})
