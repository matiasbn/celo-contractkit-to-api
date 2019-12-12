import debug from 'debug'

// Set debug namespace for our app
// https://github.com/visionmedia/debug/issues/117
const debugMongo = debug('pipol::mongo')
const debugExpress = debug('pipol::express')
const debugStart = debug('pipol::start')
const debugRoutes = debug('pipol::routes')
const debugControllers = debug('pipol::controllers')
const debugAgenda = debug('pipol::agenda')
const debugWorkers = debug('pipol::workers')
const debugTest = debug('pipol::test')

export {
  debugMongo,
  debugExpress,
  debugStart,
  debugRoutes,
  debugControllers,
  debugTest,
  debugAgenda,
  debugWorkers,
}
