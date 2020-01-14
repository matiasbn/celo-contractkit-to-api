/* eslint-disable max-len */
import { Router } from 'express'
import trimRequest from 'trim-request'
import Controller from '../controllers/transfer'
import validation from '../validators/transfer'
import validator from '../middlewares/validator'
import jwtAuth from '../middlewares/jwt-auth'

const router = new Router()

// Authenticated route
router
  .use(jwtAuth)
  .use(trimRequest.all)
/**
 *
 * @api {post} /transfer/cusd
 * @apiGroup Transfer
 * @apiName Celo dollar
 * @apiVersion 1.0.0
 *
 * @apiDescription Transfer Celo dollars between contracts
 * @apiHeader {String} Authorization   access token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E"
 *     }
 *
 * @apiParam {String} body.address 'from' address
 * @apiParam {String} body.toAddress destination address
 * @apiParam {String} body.amount amount of Celo dollars to be transferred in 'dollars'
 * @apiParamExample {json} Request-Example:
 *    {
 *      "address":"0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e",
 *      "toAddress":"0xa69e00F62c9cf089fC263E4fC6696f271271Ff59",
 *      "amount":"0.01"
 *    }
 *
 * @apiSuccess {String} address  'from' address (same as request body)
 * @apiSuccess {String} toAddress  toAddress (same as request body)
 * @apiSuccess {String} amount  amount (same as request body)
 * @apiSuccess {String} type 'transfer-cusd'
 * @apiSuccess {Number} status   HTTP status code
 * @apiSuccess {Boolean} success   boolean access success flag
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *        "address": "0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e",
 *        "toAddress": "0xa69e00F62c9cf089fC263E4fC6696f271271Ff59",
 *        "amount": "0.01",
 *        "type": "transfer-cusd",
 *        "status": 200,
 *        "success": true
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
router.post('/cusd',
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.transferCUSD)


/**
 *
 * @api {post} /transfer/cgld
 * @apiGroup Transfer
 * @apiName Celo gold
 * @apiVersion 1.0.0
 *
 * @apiDescription Transfer Celo golds between contracts
 * @apiHeader {String} Authorization   access token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E"
 *     }
 *
 * @apiParam {String} body.address 'from' address
 * @apiParam {String} body.toAddress destination address
 * @apiParam {String} body.amount amount of Celo golds to be transferred in 'dollars'
 * @apiParamExample {json} Request-Example:
 *    {
 *      "address":"0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e",
 *      "toAddress":"0xa69e00F62c9cf089fC263E4fC6696f271271Ff59",
 *      "amount":"0.01"
 *    }
 *
 * @apiSuccess {String} address  'from' address (same as request body)
 * @apiSuccess {String} toAddress  toAddress (same as request body)
 * @apiSuccess {String} amount  amount (same as request body)
 * @apiSuccess {String} type 'transfer-cgld'
 * @apiSuccess {Number} status   HTTP status code
 * @apiSuccess {Boolean} success   boolean access success flag
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *        "address": "0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e",
 *        "toAddress": "0xa69e00F62c9cf089fC263E4fC6696f271271Ff59",
 *        "amount": "0.01",
 *        "type": "transfer-cgld",
 *        "status": 200,
 *        "success": true
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
router.post('/cgld',
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.transferCGLD)

export default router
