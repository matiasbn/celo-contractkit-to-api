import debug from 'debug'

// Set debug namespace for our app
// https://github.com/visionmedia/debug/issues/117
const debugApp = debug('app')
const debugWallet = debug('wallet')
const debugTransacion = debug('transaction')
const debugStorage = debug('storage')

export {
  debugApp,
  debugWallet,
  debugTransacion,
  debugStorage,
}
