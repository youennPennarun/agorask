const fs = require('fs');
const path = require('path');
const Schema = require('./schemas');
const { graphql } = require('graphql');
const { introspectionQuery, printSchema } = require('graphql/utilities');

// Save JSON of full schema introspection for Babel Relay Plugin to use
(async () => {
  var result = await (graphql(Schema, introspectionQuery));
  if (result.errors) {
    console.error(
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2)
    );
  } else {
    fs.writeFileSync(
      path.join(__dirname, './schema.json'),
      JSON.stringify(result, null, 2)
    );
  }
})();

// Save user readable type system shorthand of schema
fs.writeFileSync(
  path.join(__dirname, './schema.graphql'),
  printSchema(Schema)
);

console.log('Done. Restart React Native packager using: \n');
console.log('  react-native start --reset-cache\n');