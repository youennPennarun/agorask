const DEFAULT_ENV = {}

module.exports = {
  branches: {
    "development": {
      gradleCommand: 'assembleDev',
      envFile: ".env.dev",
      env: {
        ...DEFAULT_ENV,
      }
    },
    "master": {
      gradleCommand: 'assembleRelease',
      envFile: ".env.production",
      env: {
        ...DEFAULT_ENV,
      }
    }
  }
}