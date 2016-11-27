const DEFAULT_ENV = {}

module.exports = {
  deployTo: "https://agorask.herokuapp.com",
  branches: {
    "development": {
      buildType: "dev",
      gradleCommand: 'assembleDev',
      envFile: ".env.dev",
      env: Object.assign({}, DEFAULT_ENV, {}),
      out: "app-dev.apk"
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