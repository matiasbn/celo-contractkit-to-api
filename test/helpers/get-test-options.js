import TEST_CONFIG from '../common/test-config'

const getTestOptions = (scriptName) => {
  const namePieces = scriptName.split('.')
  const testName = `test-${namePieces[0]}-${namePieces[1]}`
  const testOptions = TEST_CONFIG.find((config) => config.databaseName === testName)
  return testOptions
}

export default getTestOptions
