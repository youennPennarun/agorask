const spawn = require('child_process').spawn;
const cucumberArguments = [].concat(process.argv.slice(2));

let updateScreenshots = false;



function startTests() {
  return new Promise((resolve, reject) => {
    const cucumber = spawn('./node_modules/.bin/cucumberjs', cucumberArguments);
    cucumber.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    cucumber.on('close', (code) => {
      if (code === 0) {
        return resolve();
      } else {
        return reject(code);
      }
    });
  })
}

startTests()
  .then(() => console.log('Tests done'))
  .catch(code => {
    process.exit(code);
  })

