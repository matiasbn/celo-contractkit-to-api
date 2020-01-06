import debug from 'debug'

// Set debug namespace for our app
// https://github.com/visionmedia/debug/issues/117
const debugAuth = debug('pipol::auth')
const debugMongo = debug('pipol::mongo')
const debugExpress = debug('pipol::express')
const debugStart = debug('pipol::start')
const debugRoutes = debug('pipol::routes')
const debugControllers = debug('pipol::controllers')
const debugBull = debug('pipol::bull')
const debugWorkers = debug('pipol::workers')
const debugTest = debug('pipoltest::test')

export {
  debugAuth,
  debugMongo,
  debugExpress,
  debugStart,
  debugRoutes,
  debugControllers,
  debugTest,
  debugBull,
  debugWorkers,
}
