
import agenda from '~/src/config/agenda'
import WORKER_NAMES from '~/src/common/worker-names'
import Transfer from './transfer'
import { debugAgenda } from '~/src/config/debug'
import Logger from '~/src/config/logger'

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

export default enqueueJob
