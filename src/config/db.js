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
  constructor(_options) {
    let databaseName = null
    let appPort = null
    if (_options) { databaseName = _options.databaseName; appPort = _options.appPort }
    this.instance = null
    this.expressPort = appPort || process.env.APP_PORT || null
    this.database = databaseName || process.env.DATABASE_NAME || 'celopipol'
    this.mongoDatabaseUri = `${process.env.MONGO_URI}${this.database}` || 'mongodb://localhost/test'
    debugMongo('mongo-uri', this.mongoDatabaseUri)
    debugMongo('api-port', this.expressPort)
    debugTest('mongo-uri', this.mongoDatabaseUri)
    debugTest('api-port', this.expressPort)
  }

  async createInstance(app) {
    try {
      await mongoose.connect(this.mongoDatabaseUri, options)
      debugMongo('Mongodb connected')
      debugTest('Mongodb connected')
      if (app) {
        const server = http.createServer(app)
        debugMongo('Starting Express Server...')
        debugTest('Starting Express Server...')
        server.listen(this.expressPort, () => {
          debugExpress(`Server running on port: ${this.expressPort}`)
          debugTest(`Server running on port: ${this.expressPort}`)
        })
      }
      this.instance = mongoose
      return this.instance
    } catch (error) {
      debugMongo(`Failed to connect to mongodb ${error.toString()}`)
      debugTest(`Failed to connect to mongodb ${error.toString()}`)
      return null
    }
  }

  getInstance(app) {
    if (!this.instance) {
      return this.createInstance(app)
    }
    return this.instance
  }
}

export default MongoClient
