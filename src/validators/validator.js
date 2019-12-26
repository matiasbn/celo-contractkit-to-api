/* eslint-disable no-return-assign */
import { validationResult } from 'express-validator'

const validate = (request, res, next) => {
  const errors = validationResult(request)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = {}
  errors.array().forEach((error) => extractedErrors[error.param] = error.msg)

  return res.error({ ...extractedErrors }, 422)
}

export default validate
