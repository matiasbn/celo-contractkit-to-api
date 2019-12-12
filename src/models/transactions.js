import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import crypto from 'crypto'

const getHash = (address, nonce) => {
  const hash = crypto.createHash('sha256')
  const parametersToHash = [`${address}`, `${nonce}`]
  hash.update(parametersToHash.join(' '))
  return hash.digest('hex')
}

const TransactionSchema = new Schema({
  selectorHash: {
    type: String,
    unique: true,
  },
  txHash: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  nonce: {
    type: Number,
    required: true,
  },
}, {
  autoIndex: true,
  timestamps: true,
})

TransactionSchema.plugin(uniqueValidator)

// eslint-disable-next-line func-names
TransactionSchema.pre('save', function (next) {
  this.selectorHash = getHash(this.address, this.nonce)
  next()
})

TransactionSchema.statics = {
  get(address, nonce) {
    const selectorHash = getHash(address, nonce)
    return this.findOne({ selectorHash }, { _id: 0, txHash: 1 }).lean()
  },
  getHash(address, nonce) {
    return getHash(address, nonce)
  },
}
export default mongoose.model('transactions', TransactionSchema)
