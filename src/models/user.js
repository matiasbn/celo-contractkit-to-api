import mongoose, { Schema } from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcryptjs'

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  autoIndex: true,
})

UserSchema.plugin(mongooseUniqueValidator)

// eslint-disable-next-line func-names
UserSchema.pre('save', function (next) {
  try {
    this.password = bcrypt.hashSync(this.password, 10)
    return next()
  } catch (error) {
    return next(error)
  }
})

UserSchema.method({
  verifyPassword(password) {
    return new Promise((resolve, reject) => {
      if (bcrypt.compareSync(password, this.password)) {
        return resolve(true)
      }
      return reject(new Error('Incorrect password'))
    })
  },
})

module.exports = mongoose.model('User', UserSchema, 'users')
