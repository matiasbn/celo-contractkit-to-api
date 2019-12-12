import Agenda from 'agenda'
import mongoose from 'mongoose'
import Logger from './logger'
import emitter from './emitter'

const agenda = new Agenda({
  name: 'agenda-jobs',
  maxConcurrency: 1,
  mongo: mongoose.connection,
})

agenda.on('start', (job) => {
  const {
    address, toAddress, amount, jobType,
  } = job.attrs.data
  const parsedMessage = `[STARTED]-[FROM:${address}]-[TO:${toAddress}]-[TYPE:${jobType}]${amount ? `-[AMOUNT:${amount}` : ''}`
  Logger.info(parsedMessage)
})

agenda.on('success', async (job) => {
  const {
    address, toAddress, amount, emitHash, jobType,
  } = job.attrs.data
  emitter.emit(emitHash, {
    address, toAddress, amount, type: jobType, success: true,
  })
  const parsedMessage = `[SUCCESS]-[FROM:${address}]-[TO:${toAddress}]-[TYPE:${jobType}]${amount ? `-[AMOUNT:${amount}]` : ''}`
  Logger.info(parsedMessage)
  await job.remove()
})

agenda.on('fail', async (job) => {
  const {
    address, toAddress, amount, emitHash, jobType,
  } = job.attrs.data
  emitter.emit(emitHash, {
    address, toAddress, amount, type: jobType, success: false,
  })
  const parsedMessage = `[FAILED ]-[FROM:${address}]-[TO:${toAddress}]-[TYPE:${jobType}]${amount ? `-[AMOUNT:${amount}` : ''}`
  Logger.info(parsedMessage)
  await job.remove()
})

async function graceful() {
  await agenda.stop()
  process.exit(0)
}

process.on('SIGTERM', graceful)
process.on('SIGINT', graceful)

export default agenda
