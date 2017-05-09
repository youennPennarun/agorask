const addTask = `
  mutation addTask($venueId: ID!, $task: TaskInput!, $token: String!) {
    task(venueId: $venueId, task: $task, token: $token) {
      _id,
      title,
      postedBy {
        userId,
        username
      },
      date,
    }
  }
`;

const getTask = `
  query TaskDetails($id: ID!, $token: String) {
    task(id: $id) {
      _id,
      title,
      date,,
      postedBy {
        username
      }
      answers {
        _id
        answer,
        postedBy {
          username
        }
        date
        rating
        userRating(token: $token) {
          rating
        }
      }
    }
  }
`;

module.exports = {
  addTask,
  getTask,
};
