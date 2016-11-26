const DEFAULT_ENV = {}

module.exports = {
  deployTo: "https://agorask.herokuapp.com",
  branches: {
    "development": {
      gradleCommand: 'assembleRelease',
      envFile: ".env.dev",
      env: Object.assign({}, DEFAULT_ENV, {}),
      out: "app-dev-release.apk"
    },
    "master": {
      gradleCommand: 'assembleRelease',
      envFile: ".env.production",
      env: Object.assign({}, DEFAULT_ENV, {}),
      out: "app-release.apk"
    }
  }
}