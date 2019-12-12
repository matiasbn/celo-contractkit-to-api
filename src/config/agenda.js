import Agenda from 'agenda'
import mongoose from 'mongoose'
import { debugAgenda } from './debug'
import Transfer from '../workers/transfer'
import WORKER_NAMES from '../common/worker-names'
import Logger from './logger'
import emitter from '~/src/config/emitter'

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

agenda.on('FAIL', async (job) => {
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

agenda.define(WORKER_NAMES.TRANSFER_CUSD, async (job, done) => {
  try {
    const {
      privateKey, address, toAddress, amount,
    } = job.attrs.data
    await Transfer.cUSD(privateKey, address, toAddress, amount)
    done()
  } catch (error) {
    done(error)
  }
})

const enqueueJob = async (parameters, jobType) => {
  try {
    debugAgenda({ jobType, ...parameters })
    const job = agenda.create(jobType, { jobType, ...parameters })
    await job.save()
  } catch (error) {
    Logger.error(error)
  }
}

async function graceful() {
  await agenda.stop()
  process.exit(0)
}

process.on('SIGTERM', graceful)
process.on('SIGINT', graceful)

export {
  agenda,
  enqueueJob,
}
