const addAnswer = `
  mutation answer($taskId: ID!, $answer: AnswerInput!, $token: String!) {
    answer(taskId: $taskId, answer: $answer, token: $token) {
      _id
      answer
      date
      postedBy {
        username
      }
    }
  }
`;
module.exports = {
  addAnswer,
};
