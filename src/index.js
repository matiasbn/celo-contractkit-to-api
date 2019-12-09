
import './config/env'
import MongoClient from './config/db'
import app from './config/express'
import Logger from './config/logger'

(async () => {
  try {
    await new MongoClient().getInstance(app)
  } catch (error) {
    Logger.error(error)
  }
})()
