import Agenda from 'agenda'
import mongoose from 'mongoose'
import { debugAgenda } from './debug'
import Transfer from '../workers/transfer'
import WORKER_NAMES from '../common/worker-names'

const agenda = new Agenda({
  name: 'agenda-jobs',
  maxConcurrency: 1,
  mongo: mongoose.connection,
})

agenda.define(WORKER_NAMES.TRANSFER_CUSD, async (job, done) => {
  try {
    const {
      privateKey, address, toAddress, amount,
    } = job.attrs.data
    debugAgenda(privateKey, address, toAddress, amount)
    await Transfer.cUSD(privateKey, address, toAddress, amount)
    done()
  } catch (error) {
    done(error)
  }
})

const enqueueJob = async (parameters, jobType) => {
  try {
    debugAgenda(parameters)
    const job = agenda.create(jobType, { ...parameters })
    await job.save()
  } catch (error) {
    debugAgenda(error)
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
// agenda.on('start', (job) => {
//   const {
//     company, date: preDate, unit, reprocessingData,
//   } = job.attrs.data
//   const parsedMessage = `[STARTED]-[${unit}]-[${parsedDate}]-[${company.name}]`
//   Logger.info(parsedMessage)
// })

// agenda.on('success', (job) => {
//   const {
//     company, date: preDate, unit, reprocessingData,
//   } = job.attrs.data
//   const parsedMessage = `[SUCCESS]-[${unit}]-[${parsedDate}]-[${company.name}]`
//   Logger.info(parsedMessage)
//   if (!reprocessingData) {
//     delay(async () => {
//       await job.remove()
//     }, 1000)
//   }
// })

// agenda.on('fail', (error, job) => {
//   const {
//     company, date: preDate, unit, reprocessingData,
//   } = job.attrs.data
//   const parsedMessage = `[FAIL   ]-[${unit}]-[${parsedDate}]-[${company.name}]`
//   Logger.error(parsedMessage)
//   if (!reprocessingData) {
//     delay(async () => {
//       await job.remove()
//     }, 1000)
//   }
// })
