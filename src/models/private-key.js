import mongoose, { Schema } from 'mongoose'

const PrivateKeySchema = new Schema({
  privateKey: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
}, {
  autoIndex: true,
  timestamps: true,
})

export default mongoose.model('private-keys', PrivateKeySchema)
