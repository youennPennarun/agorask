/* global test expect */
const fetch = require('node-fetch');
const co = require('co');

test('get a venue by Id', () => {
  return co(function* () {
    const query = `
      query q($id: ID!) {
        venue(id: $id)  {
        _id
        name
        foursquareId
        website
        address {
          location
          formatted
        } 
        categories {
          name
          icon
        }
        tasks {
          _id
          title
          nbAnswers
        }
        contact {
          facebookName
          facebook
          twitter
          formattedPhone
          phone
        }
      }
    }
    `;
    const variables = {
      id: '581773476d568ac7723e1bae'
    };
    const response = yield fetch(`http://localhost:3000/graphql`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query, variables}),
    });
    return response.json()
  }).then(json => {
    expect(json).toMatchSnapshot();
  });
});
