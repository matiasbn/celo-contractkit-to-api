define({ "api": [
  {
    "type": "post",
    "url": "/auth/create",
    "title": "",
    "group": "Auth",
    "name": "Create",
    "version": "1.0.0",
    "description": "<p>Create an authorized user account using a secret.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.name",
            "description": "<p>user name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.password",
            "description": "<p>user password.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.secret",
            "description": "<p>secret to create an authorized user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"name\":\"Mt2fge4xYCYPic6j2hYRU4WLFFkMFCpRczDbfvBQHCyt3c8PPGdtUFoTkzAne4vK\",\n   \"password\":\"wwUz2YrXwQMyWuWCfrjmWq4BqhtVCpik2tgYFyKkVepzFxXxyYoYTfdRs2fbXoH3\",\n   \"secret\":\"df4qDK3n4NZ87Ad6JTMahVbsh3uswZxhCr8peNKzNiQtJG9D6nnK7g2tiWy8Hec\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>generated user id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>authorized user name (same as in request body)</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": \"5e1dcfedd6fa3e8367027745\",\n    \"name\": \"Mt2fge4xYCYPic6j2hYRU4WLFFkMFCpRczDbfvBQHCyt3c8PPGdtUFoTkzAne4vK\",\n    \"status\": 200,\n    \"success\": true,\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>error cause</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"status\": 401,\n    \"success\": false,\n    \"message\": \"user creation secret is incorrect\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/delete",
    "title": "",
    "group": "Auth",
    "name": "Delete",
    "version": "1.0.0",
    "description": "<p>Delete authorized user using only the access token.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>access token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>deleted user id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>deleted user name</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": \"5e1dcfedd6fa3e8367027745\",\n    \"name\": \"Mt2fge4xYCYPic6j2hYRU4WLFFkMFCpRczDbfvBQHCyt3c8PPGdtUFoTkzAne4vK\",\n    \"status\": 200,\n    \"success\": true,\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>error cause</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"status\": 401,\n    \"success\": false,\n    \"message\": \"user not found\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/login",
    "title": "",
    "group": "Auth",
    "name": "Login",
    "version": "1.0.0",
    "description": "<p>Obtain an access token and a refresh token to access authenticated routes.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.name",
            "description": "<p>Authorized user name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.password",
            "description": "<p>Authorized user password.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"name\": \"authorized_user_name\",\n   \"password\": \"authorized_user_password\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "accessToken",
            "description": "<p>Json Web Token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>Refresh token to refresh access token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "tokenType",
            "description": "<p>Self explanatory</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"accessToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E\",\n    \"refreshToken\": \"6a960c1cf33cdc336d8fccbc5f1d46452721f9989449ef952331a5038e27ed9359c98496e60ebddee7cdcba28acbc57aa4b80c4c49b1c4ab22302fe56a6f69b2\",\n    \"tokenType\": \"Bearer\",\n    \"status\": 200,\n    \"success\": true,\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>error cause</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"status\": 401,\n    \"success\": false,\n    \"message\": \"incorrect name or password\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/refresh",
    "title": "",
    "group": "Auth",
    "name": "Refresh",
    "version": "1.0.0",
    "description": "<p>Refresh the access token.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.refreshToken",
            "description": "<p>refresh token obtained on login.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"refreshToken\":\"fea93340d05656b5627cbce3fd1582c156fe71a045a67092ddf42a9bdde9d126b5e36a551c834089279275efa69e09d2e498064ade3d1c490958478a5717a686\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "accessToken",
            "description": "<p>Json Web Token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>Refresh token to refresh access token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "tokenType",
            "description": "<p>Self explanatory</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"accessToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E\",\n    \"refreshToken\": \"6a960c1cf33cdc336d8fccbc5f1d46452721f9989449ef952331a5038e27ed9359c98496e60ebddee7cdcba28acbc57aa4b80c4c49b1c4ab22302fe56a6f69b2\",\n    \"tokenType\": \"Bearer\",\n    \"status\": 200,\n    \"success\": true,\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>error cause</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"status\": 401,\n    \"success\": false,\n    \"message\": \"refresh token is invalid\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/balance/cusd",
    "title": "",
    "group": "Balance",
    "name": "Celo_Dollar",
    "version": "1.0.0",
    "description": "<p>Get the Celo dollar balance for certain address</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.address",
            "description": "<p>address of the wallet to get the balance</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"address\":\"0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "balance",
            "description": "<p>Celo dollar balance in 'dollars'</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"balance\": \"10\",\n    \"status\": 200,\n    \"success\": true,\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>error cause</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n    \"status\": 422,\n    \"success\": false,\n    \"message\": {\n          \"address\":\"given address is not checksum address\",\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/balance.js",
    "groupTitle": "Balance"
  },
  {
    "type": "get",
    "url": "/balance/cgld",
    "title": "",
    "group": "Balance",
    "name": "Celo_Gold",
    "version": "1.0.0",
    "description": "<p>Get the Celo gold balance for certain address</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.address",
            "description": "<p>address of the wallet to get the balance</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"address\":\"0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "balance",
            "description": "<p>Celo gold balance in 'dollars'</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"balance\": \"10\",\n    \"status\": 200,\n    \"success\": true,\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>error cause</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n    \"status\": 422,\n    \"success\": false,\n    \"message\": {\n          \"address\":\"given address is not checksum address\",\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/balance.js",
    "groupTitle": "Balance"
  },
  {
    "type": "post",
    "url": "/transfer/cusd",
    "title": "",
    "group": "Transfer",
    "name": "Celo_dollar",
    "version": "1.0.0",
    "description": "<p>Transfer Celo dollars between contracts</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>access token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.address",
            "description": "<p>'from' address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.toAddress",
            "description": "<p>destination address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.amount",
            "description": "<p>amount of Celo dollars to be transferred in 'dollars'</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"address\":\"0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e\",\n  \"toAddress\":\"0xa69e00F62c9cf089fC263E4fC6696f271271Ff59\",\n  \"amount\":\"0.01\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>'from' address (same as request body)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "toAddress",
            "description": "<p>toAddress (same as request body)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "amount",
            "description": "<p>amount (same as request body)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>'transfer-cusd'</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"address\": \"0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e\",\n    \"toAddress\": \"0xa69e00F62c9cf089fC263E4fC6696f271271Ff59\",\n    \"amount\": \"0.01\",\n    \"type\": \"transfer-cusd\",\n    \"status\": 200,\n    \"success\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>error cause</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n    \"status\": 422,\n    \"success\": false,\n    \"message\": {\n          \"address\":\"given address is not checksum address\",\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/transfer.js",
    "groupTitle": "Transfer"
  },
  {
    "type": "post",
    "url": "/transfer/cgld",
    "title": "",
    "group": "Transfer",
    "name": "Celo_gold",
    "version": "1.0.0",
    "description": "<p>Transfer Celo golds between contracts</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>access token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.address",
            "description": "<p>'from' address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.toAddress",
            "description": "<p>destination address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.amount",
            "description": "<p>amount of Celo golds to be transferred in 'dollars'</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"address\":\"0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e\",\n  \"toAddress\":\"0xa69e00F62c9cf089fC263E4fC6696f271271Ff59\",\n  \"amount\":\"0.01\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>'from' address (same as request body)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "toAddress",
            "description": "<p>toAddress (same as request body)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "amount",
            "description": "<p>amount (same as request body)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>'transfer-cgld'</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"address\": \"0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e\",\n    \"toAddress\": \"0xa69e00F62c9cf089fC263E4fC6696f271271Ff59\",\n    \"amount\": \"0.01\",\n    \"type\": \"transfer-cgld\",\n    \"status\": 200,\n    \"success\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>error cause</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n    \"status\": 422,\n    \"success\": false,\n    \"message\": {\n          \"address\":\"given address is not checksum address\",\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/transfer.js",
    "groupTitle": "Transfer"
  },
  {
    "type": "post",
    "url": "/wallet/create",
    "title": "",
    "group": "Wallet",
    "name": "Create",
    "version": "1.0.0",
    "description": "<p>Creates a wallet and associate it to a phone number</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>access token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.phone",
            "description": "<p>user's phone number</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"phone\": \"+56912345678\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>created address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>user's phone number (same as request body)</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"address\": \"0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e\",\n    \"phone\": \"+569812345678\"\n    \"status\": 200,\n    \"success\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>error cause</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n    \"status\": 422,\n    \"success\": false,\n    \"message\": {\n          \"phone\":\"phone with bad format\",\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/wallet.js",
    "groupTitle": "Wallet"
  },
  {
    "type": "post",
    "url": "/wallet/delete",
    "title": "",
    "group": "Wallet",
    "name": "Delete",
    "version": "1.0.0",
    "description": "<p>delete a user wallet address</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>access token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.phone",
            "description": "<p>user's phone number</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"phone\": \"+56912345678\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>deleted address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>user's phone number (same as request body)</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"address\": \"0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e\",\n    \"phone\": \"+569812345678\"\n    \"status\": 200,\n    \"success\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>error cause</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n    \"status\": 422,\n    \"success\": false,\n    \"message\": {\n          \"phone\":\"phone with bad format\",\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/wallet.js",
    "groupTitle": "Wallet"
  },
  {
    "type": "get",
    "url": "/wallet/fetch",
    "title": "",
    "group": "Wallet",
    "name": "Fetch",
    "version": "1.0.0",
    "description": "<p>Fetch a user wallet address</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>access token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.phone",
            "description": "<p>user's phone number</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"phone\": \"+56912345678\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>fetch address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>user's phone number (same as request body)</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"address\": \"0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e\",\n    \"phone\": \"+569812345678\"\n    \"status\": 200,\n    \"success\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>error cause</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n    \"status\": 422,\n    \"success\": false,\n    \"message\": {\n          \"phone\":\"phone with bad format\",\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/wallet.js",
    "groupTitle": "Wallet"
  },
  {
    "type": "post",
    "url": "/wallet/update",
    "title": "",
    "group": "Wallet",
    "name": "Update",
    "version": "1.0.0",
    "description": "<p>updates a user wallet address</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>access token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTFkY2ZlZGQ2ZmEzZTgzNjcwMjc3NDUiLCJpYXQiOjE1NzkwMTIwODQsImV4cCI6MTU3OTAxNTY4NH0.FVESFqjGiQ9Cuntt7wtn04MxzRh66zO-pWpArTNFp1E\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.phone",
            "description": "<p>user's phone number</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"phone\": \"+56912345678\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>updated address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>user's phone number (same as request body)</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"address\": \"0x6a0dAfb8f3Ee6f15d0DE9A90690bd8DBCF61f33e\",\n    \"phone\": \"+569812345678\"\n    \"status\": 200,\n    \"success\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>HTTP status code</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>boolean access success flag</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>error cause</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n    \"status\": 422,\n    \"success\": false,\n    \"message\": {\n          \"phone\":\"phone with bad format\",\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/wallet.js",
    "groupTitle": "Wallet"
  }
] });
