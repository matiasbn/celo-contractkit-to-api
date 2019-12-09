import mongoose from 'mongoose'
import bluebird from 'bluebird'
import ms from 'ms'
import http from 'http'
import { debugMongo, debugExpress, debugTest } from './debug'
import app from './express'

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
    const { databaseName, appPort } = _options
    this.instance = null
    this.expressPort = appPort || process.env.APP_PORT || 3000
    this.app = appPort && true
    this.database = databaseName || process.env.DATABASE_NAME || 'celopipol'
    this.mongoDatabaseUri = `${process.env.MONGO_URI}${this.database}` || 'mongodb://localhost/test'
    debugMongo('mongo-uri', this.mongoDatabaseUri)
    debugMongo('api-port', this.mongoDatabaseUri)
    debugTest('mongo-uri', this.mongoDatabaseUri)
    debugTest('api-port', this.expressPort)
  }

  async createInstance() {
    try {
      await mongoose.connect(this.mongoDatabaseUri, options)
      debugMongo('Mongodb connected')
      debugTest('Mongodb connected')
      if (this.app) {
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

  getInstance() {
    if (!this.instance) {
      return this.createInstance()
    }
    return this.instance
  }
}

export default MongoClient
