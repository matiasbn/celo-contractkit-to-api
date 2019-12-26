import Joi from '@hapi/joi'

// const mainSchema = {

// }

// const testSchema = {

// }

const environmentSchema = (environment) => {
  const joiString = Joi.string()
  return {
    NODE_ENV: joiString.required().valid('development', 'production', 'test').default('development'),
    MONGO_URI: joiString.required(),
    KEY_SIZE: joiString.required(),
    CELO_URL: joiString.required(),
    ...environment === 'main' && { DATABASE_NAME: joiString.required() },
  }
}

export default environmentSchema
