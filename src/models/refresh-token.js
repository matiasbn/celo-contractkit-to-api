import mongoose, { Schema } from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

const RefreshTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  issuedAt: {
    type: Date,
    required: true,
  },
  revoked: {
    type: Boolean,
    required: true,
    default: true,
  },
}, {
  timestamps: true,
  autoIndex: true,
})

RefreshTokenSchema.plugin(mongooseUniqueValidator)


module.exports = mongoose.model('RefreshToken', RefreshTokenSchema, 'refresh-token')
