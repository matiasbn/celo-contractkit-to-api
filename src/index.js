
import './config/env'
import MongoClient from './config/db'
import app from './config/express'

new MongoClient().getInstance(app)
