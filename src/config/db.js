import mongoose from 'mongoose'
import bluebird from 'bluebird'
import ms from 'ms'
import http from 'http'
import { debugMongo, debugExpress, debugTest } from './debug'

const options = {
  promiseLibrary: bluebird,
  keepAlive: ms('30s'),
  connectTimeoutMS: ms('30s'),
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}

mongoose.set('useCreateIndex', true)

class MongoClient {
  constructor(databaseName) {
    this.instance = null
    this.expressPort = process.env.APP_PORT || 3000
    this.database = databaseName || process.env.DATABASE_NAME || 'celopipol'
    this.mongoDatabaseUri = `${process.env.MONGO_URI}${this.database}` || 'mongodb://localhost/test'
    debugMongo('mongo-uri', this.mongoDatabaseUri)
    debugTest('mongo-uri', this.mongoDatabaseUri)
  }

  createInstance(app) {
    mongoose
      .connect(this.mongoDatabaseUri, options)
      .then(() => debugMongo('Mongodb connected'))
      .catch((error) => debugMongo(`Failed to connect to mongodb ${error.toString()}`))

    mongoose
      .connection
      .once('open', () => {
        if (app) {
          const server = http.createServer(app)
          debugMongo('Starting Express Server...')

          server.listen(this.expressPort, () => debugExpress(`Server running on port: ${this.expressPort}`))
        }
      })
    this.instance = mongoose
    return this.instance
  }

  getInstance(app) {
    if (!this.instance) {
      return this.createInstance(app)
    }

    return this.instance
  }
}

export default MongoClient
