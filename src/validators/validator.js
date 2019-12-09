/* eslint-disable no-return-assign */
import { validationResult } from 'express-validator'

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = {}
  errors.array().forEach((err) => extractedErrors[err.param] = err.msg)

  return res.error({ ...extractedErrors }, 422)
}

export default validate
