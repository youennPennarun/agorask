const DEFAULT_ENV = {}

module.exports = {
  branches: {
    "development": {
      gradleCommand: 'assembleRelease',
      envFile: ".env.dev",
      env: Object.assign({}, DEFAULT_ENV, {}),
    },
    "master": {
      gradleCommand: 'assembleRelease',
      envFile: ".env.production",
      env: Object.assign({}, DEFAULT_ENV, {}),
    }
  }
}