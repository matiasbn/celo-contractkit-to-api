const TEST_CONFIG = [
  {
    databaseName: 'test-route-balance',
    appPort: 3007,
    drop: true,
  },
  {
    databaseName: 'test-route-wallet',
    appPort: 3008,
    drop: true,
  },
  {
    databaseName: 'test-controller-balance',
    appPort: null,
    drop: true,
  },
  {
    databaseName: 'test-controller-wallet',
    appPort: null,
    drop: true,
  },
  {
    databaseName: 'test-worker-wallet',
    appPort: null,
    drop: true,
  },
]

export default TEST_CONFIG
