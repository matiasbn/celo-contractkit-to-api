import Queue from 'bull'
import Transfer from './transfer'
import WORKER_NAMES from '../common/worker-names'
import { debugBull } from '~/src/config/debug'
import Logger from '~/src/config/logger'
import emitter from '../config/emitter'

const queueConcurrency = 1

const queueOptions = {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
}

const parseMessage = (parameters) => {
  const parsedMessage = []
  if (parameters.jobType) parsedMessage.push(`[TYPE:${parameters.jobType}]`)
  if (parameters.email) parsedMessage.push(`[EMAIL:${parameters.email}]`)
  if (parameters.phone) parsedMessage.push(`[PHONE:${parameters.phone}]`)
  if (parameters.address) parsedMessage.push(`[ADDRESS:${parameters.address}]`)
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

const executeJob = async (job, done) => {
  try {
    const {
      privateKey, address, toAddress, amount, jobType,
    } = job.data.parameters
    switch (jobType) {
      case WORKER_NAMES.TRANSFER_CUSD:
        await Transfer.cUSD(privateKey, address, toAddress, amount)
        break
      default:
        break
    }
    done(null, job.data.parameters)
  } catch (error) {
    done(error)
  }
}

const createQueue = (queueName) => {
  const queue = new Queue(queueName, queueOptions)
  /**
 * @description state the process for the queue
 */
  queue.process(queueConcurrency, (job, done) => executeJob(job, done))

  /**
   * @description set the action for the different job states
   */
  queue.on('active', (job) => {
    const parsedMessage = `[STARTED]-${parseMessage(job.data.parameters)}`
    Logger.info(parsedMessage)
  })

  queue.on('completed', async (job, result) => {
    emitEvent(result, true)
    const parsedMessage = `[SUCCESS]-${parseMessage(result)}`
    Logger.info(parsedMessage)
    await job.remove()
  })

  queue.on('failed', async (job, error) => {
    emitEvent(job.data.parameters, false)
    const parsedMessage = `[FAILED ]-${parseMessage(job.data.parameters)}`
    Logger.error(parsedMessage)
    Logger.error(error)
    await job.remove()
  })


  async function graceful() {
    await queue.close()
    process.exit(0)
  }

  process.on('SIGTERM', graceful)
  process.on('SIGINT', graceful)

  return queue
}

const enqueueJob = async (parameters) => {
  try {
    const { address } = parameters
    // Create a queue for every address to avoid losing track of the nonce
    const queueJobCount = await Queue(address).getJobCounts()
    const isOldQueue = Object.values(queueJobCount).some((value) => value > 0)
    const queue = isOldQueue ? Queue(address) : createQueue(address)
    debugBull('bull job parameters: \n', parameters)
    queue.add({ parameters })
  } catch (error) {
    Logger.error(error)
  }
}
export default enqueueJob
