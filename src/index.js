
import './config/env'
import MongoClient from './config/db'
import app from './config/express'
import Logger from './config/logger'
import { agenda } from './config/agenda'

(async () => {
  try {
    await new MongoClient().getInstance(app)
    await agenda.start()
  } catch (error) {
    Logger.error(error)
  }
})()
