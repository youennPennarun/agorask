exports[`Should add a task`] = `
Object {
  "__v": 0,
  "_id": "[some id]",
  "answers": Array [],
  "date": "[dome date]",
  "postedBy": Object {
    "userId": "581407deb0fce75c59f74d66",
    "username": "jessica"
  },
  "title": "Task test 1",
  "venue": "5817739a6d568ac7723e1bb1"
}
`;

exports[`Should throw an error if the user is missing the id`] = `[Error: invalid user._id]`;

exports[`Should throw an error if the user is missing the username`] = `[Error: invalid user.username]`;
