/* eslint-disable max-len */
import { Router } from 'express'
import trimRequest from 'trim-request'
import Controller from '../controllers/balance'
import validation from '../validators/balance'
import validator from '../middlewares/validator'

const router = new Router()

router
  .use(trimRequest.all)
/**
 *
 * @api {get} /balance/cusd
 * @apiGroup Balance
 * @apiName Celo Dollar
 * @apiVersion 1.0.0
 *
 * @apiDescription Get the Celo dollar balance for certain address
 * @apiParam {String} body.address address of the wallet to get the balance
 * @apiParamExample {json} Request-Example:
 *    {
 *      "address":"0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e"
 *    }
 *
 * @apiSuccess {String} balance  Celo dollar balance in 'dollars'
 * @apiSuccess {Number} status   HTTP status code
 * @apiSuccess {Boolean} success   boolean access success flag
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *        "balance": "10",
 *        "status": 200,
 *        "success": true,
 *    }
 *
 * @apiError {Number} status   HTTP status code
 * @apiError {Boolean} success   boolean access success flag
 * @apiError {String} message   error cause
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 422 Unprocessable Entity
 *    {
 *        "status": 422,
 *        "success": false,
 *        "message": {
 *              "address":"given address is not checksum address",
 *        }
 *    }
 */
router.get('/cusd',
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.getUSDBalance)

/**
 *
 * @api {get} /balance/cgld
 * @apiGroup Balance
 * @apiName Celo Gold
 * @apiVersion 1.0.0
 *
 * @apiDescription Get the Celo gold balance for certain address
 * @apiParam {String} body.address address of the wallet to get the balance
 * @apiParamExample {json} Request-Example:
 *    {
 *      "address":"0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e"
 *    }
 *
 * @apiSuccess {String} balance  Celo gold balance in 'dollars'
 * @apiSuccess {Number} status   HTTP status code
 * @apiSuccess {Boolean} success   boolean access success flag
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *        "balance": "10",
 *        "status": 200,
 *        "success": true,
 *    }
 *
 * @apiError {Number} status   HTTP status code
 * @apiError {Boolean} success   boolean access success flag
 * @apiError {String} message   error cause
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 422 Unprocessable Entity
 *    {
 *        "status": 422,
 *        "success": false,
 *        "message": {
 *              "address":"given address is not checksum address",
 *        }
 *    }
 */
router.get('/cgld',
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.getGLDBalance)

export default router
