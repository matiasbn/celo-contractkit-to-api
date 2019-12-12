import mongoose from 'mongoose'
import TEST_CONFIG from '../common/test-config'

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const dropDatabse = async (databaseName) => {
  const conn = mongoose.createConnection(`${process.env.MONGO_URI}${databaseName}`, mongooseOptions)
  await conn.dropDatabase()
}

// Drop all databases after
async function cleanData() {
  const promises = []
  TEST_CONFIG.forEach((config) => {
    if (config.drop) promises.push(dropDatabse(config.databaseName))
  })
  await Promise.all(promises)
}

afterAll(async () => {
  await cleanData()
})
