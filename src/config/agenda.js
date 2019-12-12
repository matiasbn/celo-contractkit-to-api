import Agenda from 'agenda'
import mongoose from 'mongoose'
import Logger from './logger'
import emitter from './emitter'

const agenda = new Agenda({
  name: 'agenda-jobs',
  maxConcurrency: 1,
  mongo: mongoose.connection,
})

const parseMessage = (parameters) => {
  const parsedMessage = []
  if (parameters.jobType) parsedMessage.push(`[TYPE:${parameters.jobType}]`)
  if (parameters.address) parsedMessage.push(`[FROM:${parameters.address}]`)
  if (parameters.toAddress) parsedMessage.push(`[TO:${parameters.toAddress}]`)
  if (parameters.amount) parsedMessage.push(`[AMOUNT:${parameters.amount}]`)
  return parsedMessage.join('-')
}

const emitEvent = (params, success) => {
  const {
    address, toAddress, amount, emitHash, jobType,
  } = params
  emitter.emit(emitHash, {
    address, toAddress, amount, type: jobType, success,
  })
}

agenda.on('start', (job) => {
  const parsedMessage = `[STARTED]-${parseMessage(job.attrs.data)}`
  Logger.info(parsedMessage)
})

agenda.on('success', async (job) => {
  emitEvent(job.attrs.data, true)
  const parsedMessage = `[SUCCESS]-${parseMessage(job.attrs.data)}`
  Logger.info(parsedMessage)
  await job.remove()
})

agenda.on('fail', async (job) => {
  emitEvent(job.attrs.data, false)
  const parsedMessage = `[FAILED ]-${parseMessage(job.attrs.data)}`
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
