import crypto from 'crypto'

const getSha256 = (parameters) => {
  const hash = crypto.createHash('sha256')
  hash.update(parameters.join(' '))
  return hash.digest('hex')
}

export default getSha256
