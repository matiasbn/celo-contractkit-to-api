import mongoose from 'mongoose'
import bluebird from 'bluebird'
import ms from 'ms'
import { debugMongoose } from './debug'
import Logger from './logger'

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
    .then(() => Logger.info('Mongodb connected'))
    .catch((error) => debugMongoose(`Failed to connect to mongodb ${error.toString()}`))
}

export default initDB
