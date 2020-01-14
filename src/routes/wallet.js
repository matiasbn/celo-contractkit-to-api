/* eslint-disable max-len */
import { Router } from 'express'
import trimRequest from 'trim-request'
import Controller from '../controllers/wallet'
import validation from '../validators/wallet'
import validator from '../middlewares/validator'
import jwtAuth from '../middlewares/jwt-auth'

const router = new Router()

// Authenticated route
router
  .use(jwtAuth)
  .use(trimRequest.all)
/**
 *
 * @api {post} /wallet/create
 * @apiGroup Wallet
 * @apiName Create
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a wallet and associate it to a phone number
 * @apiHeader {String} Authorization   access token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E"
 *     }
 *
 * @apiParam {String} body.phone user's phone number
 * @apiParamExample {json} Request-Example:
 *    {
 *      "phone": "+56912345678"
 *    }
 *
 * @apiSuccess {String} address  created address
 * @apiSuccess {String} phone  user's phone number (same as request body)
 * @apiSuccess {Number} status   HTTP status code
 * @apiSuccess {Boolean} success   boolean access success flag
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *        "address": "0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e",
 *        "phone": "+569812345678"
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
 *              "phone":"phone with bad format",
 *        }
 *    }
 */
router.post('/create',
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.createWallet)

/**
 *
 * @api {get} /wallet/fetch
 * @apiGroup Wallet
 * @apiName Fetch
 * @apiVersion 1.0.0
 *
 * @apiDescription Fetch a user wallet address
 * @apiHeader {String} Authorization   access token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E"
 *     }
 *
 * @apiParam {String} body.phone user's phone number
 * @apiParamExample {json} Request-Example:
 *    {
 *      "phone": "+56912345678"
 *    }
 *
 * @apiSuccess {String} address  fetch address
 * @apiSuccess {String} phone  user's phone number (same as request body)
 * @apiSuccess {Number} status   HTTP status code
 * @apiSuccess {Boolean} success   boolean access success flag
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *        "address": "0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e",
 *        "phone": "+569812345678"
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
 *              "phone":"phone with bad format",
 *        }
 *    }
 */
router.get('/fetch',
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.fetchWallet)

/**
 *
 * @api {post} /wallet/delete
 * @apiGroup Wallet
 * @apiName Delete
 * @apiVersion 1.0.0
 *
 * @apiDescription delete a user wallet address
 * @apiHeader {String} Authorization   access token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E"
 *     }
 *
 * @apiParam {String} body.phone user's phone number
 * @apiParamExample {json} Request-Example:
 *    {
 *      "phone": "+56912345678"
 *    }
 *
 * @apiSuccess {String} address  deleted address
 * @apiSuccess {String} phone  user's phone number (same as request body)
 * @apiSuccess {Number} status   HTTP status code
 * @apiSuccess {Boolean} success   boolean access success flag
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *        "address": "0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e",
 *        "phone": "+569812345678"
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
 *              "phone":"phone with bad format",
 *        }
 *    }
 */
router.post('/delete',
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.deleteWallet)

/**
 *
 * @api {post} /wallet/update
 * @apiGroup Wallet
 * @apiName Update
 * @apiVersion 1.0.0
 *
 * @apiDescription updates a user wallet address
 * @apiHeader {String} Authorization   access token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E"
 *     }
 *
 * @apiParam {String} body.phone user's phone number
 * @apiParamExample {json} Request-Example:
 *    {
 *      "phone": "+56912345678"
 *    }
 *
 * @apiSuccess {String} address  updated address
 * @apiSuccess {String} phone  user's phone number (same as request body)
 * @apiSuccess {Number} status   HTTP status code
 * @apiSuccess {Boolean} success   boolean access success flag
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *        "address": "0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e",
 *        "phone": "+569812345678"
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
 *              "phone":"phone with bad format",
 *        }
 *    }
 */
router.post('/update',
  validation.checkFormat,
  validation.checkBody,
  validator,
  Controller.updateWallet)

export default router
