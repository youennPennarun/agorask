const DEFAULT_ENV = {}

module.exports = {
  deployTo: "https://agorask.herokuapp.com",
  branches: {
    "development": {
      buildType: "devRelease",
      gradleCommand: 'assembleDevRelease',
      envFile: ".env.dev",
      env: Object.assign({}, DEFAULT_ENV, {}),
      out: "app-devRelease.apk"
    },
    "master": {
      buildType: "release",
      gradleCommand: 'assembleRelease',
      envFile: ".env.production",
      env: Object.assign({}, DEFAULT_ENV, {}),
      out: "app-release.apk"
    }
  }
}