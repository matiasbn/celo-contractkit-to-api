import mongoose from 'mongoose'
import bluebird from 'bluebird'
import ms from 'ms'
import { debugApp } from './debug'

const options = {
  promiseLibrary: bluebird,
  keepAlive: ms('30s'),
  connectTimeoutMS: ms('30s'),
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}
const mongoDatabaseUri = process.env.MONGO_URI
mongoose.set('useCreateIndex', true)

const initDB = () => {
  mongoose
    .connect(mongoDatabaseUri, options)
    .then(() => debugApp('Mongodb connected'))
    .catch((error) => debugApp(`Failed to connect to mongodb ${error.toString()}`))

  // mongoose
  //   .connection
  //   .once('open', () => {
  //     const server = http.createServer(app)
  //     const IO = SocketIO(server)

  //     app.use((request, response, next) => {
  //       request.io = IO
  //       next()
  //     })

  //     logger.info('Starting Express Server...')
  //     debugApp('Starting Express Server...')

  //     server.listen(apiPort, () => logger.info('Server running'))
  //   })
}

export default initDB
