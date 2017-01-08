const path = require('path');

const commandLineArgs = require('command-line-args');
const optionDefinitions = [
  { name: 'commit-range', alias: 'c', type: String },
  { name: 'compare-url', alias: 'u', type: String },
  { name: 'build-dir', alias: 'd', type: String, defaultValue: path.join(__dirname, '../..')},
  { name: 'branch', alias: 'b', type: String },
];

const args = commandLineArgs(optionDefinitions);

if (!args['commit-range'] && args['compare-url']) {
  const re = /compare\/([0-9a-z]+)\.\.\.([0-9a-z]+)$/;
  const matches = args['compare-url'].match(re);
  if (re.length === 3) {
    args['commit-range'] = `${matches[1]}...${matches[2]}`;
  }
}

module.exports = args;