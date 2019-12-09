import express from 'express'
import consola from 'consola'
import errorHandlerMiddleware from '@feathersjs/errors/handler'
import notFoundMiddleware from '@feathersjs/errors/not-found'
import bodyParser from 'body-parser'
import compression from 'compression'
// import cors from 'cors'
import helmet from 'helmet'
import methodOverride from 'method-override'
import morgan from 'morgan'
import routes from '../routes'


const app = express()
app.set('trust proxy', true)

// Parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// gzip compression
app.use(compression({ level: 8 }))

// Secure apps by setting various HTTP headers
app.use(helmet())

// Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
app.use(methodOverride())

// Request logging. Skip if testing or production
// app.use(morgan('dev'))
app.use(morgan('dev', {
  skip() {
    return process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production'
  },
}))

// Routes
app.use('/', routes)

// Remove 'accept' header to respond with an error on JSON format
app.use((request, response, next) => {
  delete request.headers.accept
  next()
})

// Error handlers
app.use(errorHandlerMiddleware({ logger: consola }))
app.use(notFoundMiddleware())

export default app
