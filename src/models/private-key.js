import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const PrivateKeySchema = new Schema({
  privateKey: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  autoIndex: true,
  timestamps: true,
})

PrivateKeySchema.plugin(uniqueValidator)

export default mongoose.model('private-keys', PrivateKeySchema)
