const mockResponse = () => {
  const response = {}
  response.status = jest.fn().mockReturnValue(response)
  response.success = jest.fn().mockReturnValue(response)
  response.json = jest.fn().mockReturnValue(response)
  response.error = jest.fn().mockReturnValue(response)
  return response
}

export default mockResponse
