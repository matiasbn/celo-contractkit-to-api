const ERROR_MESSAGES = {
  ADDRESS_IS_EMPTY: 'address cannot be empty',
  AMOUNT_IS_EMPTY: 'amount cannot be empty',
  AMOUNT_IS_NOT_NUMBER: 'amount is not a number. Use dot (.) as separator',
  INSUFFICIENT_FUNDS: 'wallet with insufficient funds',
  INCORRECT_SECRET: 'user creation secret is incorrect',
  IS_NOT_PHONE: 'phone with bad format',
  IS_NOT_CHECKSUM_ADDRESS: 'given address is not checksum address',
  NAME_IS_EMPTY: 'name cannot be empty',
  PASSWORD_IS_EMPTY: 'password cannot be empty',
  PHONE_ALREADY_REGISTERED: 'phone already registered with a private key',
  PHONE_IS_EMPTY: 'phone cannot be empty',
  PRIVATE_KEY_NOT_FOUND: 'private key not found for given phone',
  SECRET_IS_EMPTY: 'secret cannot be empty',
  TO_ADDRESS_IS_EMPTY: 'toAddress cannot be empty',
  USER_ALREADY_EXISTS: 'user already registered',
  TRANSACTION_FAILED: 'transaction failed',
  WALLET_NOT_FOUND: 'wallet not found for given phone',
}

export default ERROR_MESSAGES
