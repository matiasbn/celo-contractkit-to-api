import mongoose from 'mongoose'
import bluebird from 'bluebird'
import ms from 'ms'
import http from 'http'
import { debugMongo, debugExpress } from './debug'

const expressPort = process.env.APP_PORT || 3000
const mongoDatabaseUri = process.env.MONGO_URI


const options = {
  promiseLibrary: bluebird,
  keepAlive: ms('30s'),
  connectTimeoutMS: ms('30s'),
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}

mongoose.set('useCreateIndex', true)

const initDB = (app) => {
  mongoose
    .connect(mongoDatabaseUri, options)
    .then(() => debugMongo('Mongodb connected'))
    .catch((error) => debugMongo(`Failed to connect to mongodb ${error.toString()}`))

  mongoose
    .connection
    .once('open', () => {
      const server = http.createServer(app)
      // const IO = SocketIO(server)

      // app.use((request, response, next) => {
      //   request.io = IO
      //   next()
      // })
      debugMongo('Starting Express Server...')

      server.listen(expressPort, () => debugExpress(`Server running on port: ${expressPort}`))
    })
}

export default initDB
