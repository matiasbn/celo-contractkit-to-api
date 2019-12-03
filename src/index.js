
import './config/env'
import initDB from './config/db'
import app from './config/express'

initDB(app)
