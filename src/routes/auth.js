/* eslint-disable max-len */
import { Router } from 'express'
import trimRequest from 'trim-request'
import Controller from '../controllers/auth'
import validation from '../validators/auth'
import validator from '../middlewares/validator'

import '../config/auth-strategies'
import jwtAuth from '../middlewares/jwt-auth'

const router = new Router()

router
  .use(trimRequest.all)
/**
 *
 * @api {post} /auth/login
 * @apiGroup Auth
 * @apiName Login
 * @apiVersion 1.0.0
 *
 * @apiDescription Obtain an access token and a refresh token
 * to access authenticated routes.
 * @apiParam {String} body.name Authorized user name.
 * @apiParam {String} body.password Authorized user password.
 * @apiParamExample {json} Request-Example:
 *    {
 *       "name": "authorized_user_name",
 *       "password": "authorized_user_password",
 *    }
 *
 * @apiSuccess {String} accessToken   Json Web Token
 * @apiSuccess {String} refreshToken   Refresh token to refresh access token
 * @apiSuccess {String} tokenType   Self explanatory
 * @apiSuccess {Number} status   HTTP status code
 * @apiSuccess {Boolean} success   boolean access success flag
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E",
 *        "refreshToken": "6a960c1cf33cdc336d8fccbc5f1d46452721f9989449ef952331a5038e27ed9359c98496e60ebddee7cdcba28acbc57aa4b80c4c49b1c4ab22302fe56a6f69b2",
 *        "tokenType": "Bearer",
 *        "status": 200,
 *        "success": true,
 *    }
 *
 * @apiError {Number} status   HTTP status code
 * @apiError {Boolean} success   boolean access success flag
 * @apiError {String} message   error cause
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 401 Unauthorized
 *    {
 *        "status": 401,
 *        "success": false,
 *        "message": "incorrect name or password",
 *    }
 */
router.post('/login',
  validation.checkBody,
  validator,
  Controller.login)

/**
 *
 * @api {post} /auth/create
 * @apiGroup Auth
 * @apiName Create
 * @apiVersion 1.0.0
 *
 * @apiDescription Create an authorized user account using a secret.
 * @apiParam {String} body.name user name.
 * @apiParam {String} body.password user password.
 * @apiParam {String} body.secret secret to create an authorized user.
 * @apiParamExample {json} Request-Example:
 *    {
 *       "name":"Mt2fge4xYCYPic6j2hYRU4WLFFkMFCpRczDbfvBQHCyt3c8PPGdtUFoTkzAne4vK",
 *       "password":"wwUz2YrXwQMyWuWCfrjmWq4BqhtVCpik2tgYFyKkVepzFxXxyYoYTfdRs2fbXoH3",
 *       "secret":"df4qDK3n4NZ87Ad6JTMahVbsh3uswZxhCr8peNKzNiQtJG9D6nnK7g2tiWy8Hec"
 *    }
 *
 * @apiSuccess {String} id   generated user id
 * @apiSuccess {String} name   authorized user name (same as in request body)
 * @apiSuccess {Number} status   HTTP status code
 * @apiSuccess {Boolean} success   boolean access success flag
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *        "id": "5e1dcfedd6fa3e8367027745",
 *        "name": "Mt2fge4xYCYPic6j2hYRU4WLFFkMFCpRczDbfvBQHCyt3c8PPGdtUFoTkzAne4vK",
 *        "status": 200,
 *        "success": true,
 *    }
 *
 * @apiError {Number} status   HTTP status code
 * @apiError {Boolean} success   boolean access success flag
 * @apiError {String} message   error cause
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 401 Unauthorized
 *    {
 *        "status": 401,
 *        "success": false,
 *        "message": "user creation secret is incorrect",
 *    }
 */
router.post('/create',
  validation.checkCreate,
  validator,
  Controller.create)

/**
 *
 * @api {post} /auth/refresh
 * @apiGroup Auth
 * @apiName Refresh
 * @apiVersion 1.0.0
 *
 * @apiDescription Refresh the access token.
 * @apiParam {String} body.refreshToken refresh token obtained on login.
 * @apiParamExample {json} Request-Example:
 *    {
 *      "refreshToken":"fea93340d05656b5627cbce3fd1582c156fe71a045a67092ddf42a9bdde9d126b5e36a551c834089279275efa69e09d2e498064ade3d1c490958478a5717a686"
 *    }
 *
 * @apiSuccess {String} accessToken   Json Web Token
 * @apiSuccess {String} refreshToken   Refresh token to refresh access token
 * @apiSuccess {String} tokenType   Self explanatory
 * @apiSuccess {Number} status   HTTP status code
 * @apiSuccess {Boolean} success   boolean access success flag
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E",
 *        "refreshToken": "6a960c1cf33cdc336d8fccbc5f1d46452721f9989449ef952331a5038e27ed9359c98496e60ebddee7cdcba28acbc57aa4b80c4c49b1c4ab22302fe56a6f69b2",
 *        "tokenType": "Bearer",
 *        "status": 200,
 *        "success": true,
 *    }
 *
 * @apiError {Number} status   HTTP status code
 * @apiError {Boolean} success   boolean access success flag
 * @apiError {String} message   error cause
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 401 Unauthorized
 *    {
 *        "status": 401,
 *        "success": false,
 *        "message": "refresh token is invalid",
 *    }
 */
router.post('/refresh',
  validation.checkRefresh,
  validator,
  Controller.refresh)


/**
 *
 * @api {post} /auth/delete
 * @apiGroup Auth
 * @apiName Delete
 * @apiVersion 1.0.0
 *
 * @apiDescription Delete authorized user using only the access token.
 * @apiHeader {String} Authorization   access token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E"
 *     }
 *
 * @apiSuccess {String} id   deleted user id
 * @apiSuccess {String} name   deleted user name
 * @apiSuccess {Number} status   HTTP status code
 * @apiSuccess {Boolean} success   boolean access success flag
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *        "id": "5e1dcfedd6fa3e8367027745",
 *        "name": "Mt2fge4xYCYPic6j2hYRU4WLFFkMFCpRczDbfvBQHCyt3c8PPGdtUFoTkzAne4vK",
 *        "status": 200,
 *        "success": true,
 *    }
 *
 * @apiError {Number} status   HTTP status code
 * @apiError {Boolean} success   boolean access success flag
 * @apiError {String} message   error cause
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 401 Unauthorized
 *    {
 *        "status": 401,
 *        "success": false,
 *        "message": "user not found",
 *    }
 */
router.post('/delete',
  jwtAuth,
  Controller.del)

export default router
