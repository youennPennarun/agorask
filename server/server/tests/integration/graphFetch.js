const fetch = require('node-fetch');

const graphFetch = function* (query, variables = {}) {
  const response = yield fetch(`http://localhost:3000/graphql`, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({query, variables}),
    });
  return response;
};

module.exports = graphFetch;
