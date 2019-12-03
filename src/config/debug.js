import debug from 'debug'

// Set debug namespace for our app
// https://github.com/visionmedia/debug/issues/117
const debugMongoose = debug('mongoose')
const debugWallet = debug('wallet')
const debugTransacion = debug('transaction')
const debugStorage = debug('storage')

export {
  debugMongoose,
  debugWallet,
  debugTransacion,
  debugStorage,
}
