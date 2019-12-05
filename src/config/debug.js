import debug from 'debug'

// Set debug namespace for our app
// https://github.com/visionmedia/debug/issues/117
const debugMongo = debug('demo::mongo')
const debugExpress = debug('demo::express')
const debugStart = debug('demo::app::start')
const debugRoutes = debug('demo::app::routes')
const debugControllers = debug('demo::app::controllers')
const debugTest = debug('demotest::test')

export {
  debugMongo,
  debugExpress,
  debugStart,
  debugRoutes,
  debugControllers,
  debugTest,
}
