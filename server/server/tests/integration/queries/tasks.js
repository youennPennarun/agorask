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

module.exports = {
  addTask,
};
