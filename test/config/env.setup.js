import appRootPath from 'app-root-path'
import dotenv from 'dotenv'
import Joi from '@hapi/joi'
import envSchema from '../../src/common/environment-schema'

dotenv.config({
  path: `${appRootPath.path}/test/.env`,
})

const environmentVarsSchema = Joi.object(envSchema('test'))
  .unknown()
  .required()

const { error } = environmentVarsSchema.validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}
