const {Task, Venue} = require('../utils/mongo/models');

const {NotFoundError} = require('../utils/errors');

const getTasks = function* (offset = 0, limit = 5) {
  const tasks = yield Task.find({})
          .skip(offset)
          .limit(limit)
          .sort({date: -1})
          .exec();
  return tasks;
};

const getTasksNearMe = function* ({latitude, longitude}, radiusMeters, userId) {
  const radiusInRad = (radiusMeters / 1000) / 6378.1;
  const andQuery = [
    {
      'venue.location': {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInRad],
        },
      },
    },
    {
      answers: {
        $size: 0,
      },
    },
  ];
  if (userId) {
    andQuery.push({
      'postedBy.userId': {
        $ne: userId,
      },
    });
  }

  return yield Task.find({
    $and: andQuery,
  });
};

const getTask = function* (id, userId, fields) {
  if (fields && !(fields instanceof Array)) {
    fields = Object.keys(fields);
  }

  const query = Task.findOne({_id: id});
  let userRatingIndex;
  if (fields) {
    userRatingIndex = fields.findIndex(field => field.startsWith('answers.votes.userRating'));
    if (userRatingIndex > -1 && userId) {
      fields[userRatingIndex] = 'answers.votes.list';
    }
    query.select(fields);
  }
  let task = yield query.exec();
  if (userRatingIndex > -1 && userId && task) {
    task = task.toObject();
    task.answers = task.answers.map(answer => {
      answer.votes.userRating = getUserRating(userId, answer.votes);
      delete answer.votes.list;
      return answer;
    });
  }
  return task;
};

const getUserRating = function(userId, votes) {
  return votes.list.find(vote => {
    return vote.user._id.toString() === userId;
  });
};

const getTasksByIds = function* (ids, fields) {
  const query = Task.find({
    _id: { $in: ids},
  });
  if (fields) {
    query.select(fields);
  }
  const tasks = yield query.exec();
  return tasks;
};

const getUserTasks = function* (username, offset = 0, limit = 10) {
  const tasks = yield Task.find({'postedBy.username': username})
          .skip(offset)
          .limit(limit)
          .sort({_id: -1})
          .exec();
  return tasks;
};

const addTask = function* (title, venueId, {_id: userId, username}, date) {
  if (!title) throw new Error('invalid title');
  if (!venueId) throw new Error('invalid venueId');
  if (!userId) throw new Error('invalid user._id');
  if (!username) throw new Error('invalid user.username');

  if (!date) {
    date = new Date();
  }
  const venue = yield Venue.findOne({_id: venueId}).exec();
  if (!venue) throw new Error(`unknown venue with id ${venueId}`);
  const taskData = new Task({
    title,
    venue: {
      _id: venue._id,
      location: venue.address.location,
    },
    postedBy: {
      userId,
      username,
    },
    date,
  });
  const task = yield taskData.save();
  venue.tasks.push({
    _id: task._id,
    title: task.title,
    nbAnswers: 0,
    postedBy: {
      userId,
      username,
    },
  });
  venue.nbTasks = (venue.nbTasks) ? venue.nbTasks + 1 : 1;
  yield venue.save();
  return task;
};

const addAnswer = function* (taskId, answer, fields) {
  answer.date = new Date();
  const query = Task.findByIdAndUpdate(
    taskId,
    {$push: {answers: answer}},
    {new: true});
  if (fields) {
    query.select(fields);
  }
  const response = yield query.exec();
  if (response) {
    return answer;
  }
  return null;
};

const vote = function* (taskId, answerId, user, voteValue) {
  if (!user || !user._id || !user.username) {
    throw new TypeError('User should have property _id and username');
  }
  if (voteValue !== '-1' && voteValue !== '+1') {
    throw new TypeError('the user rating should be \'+1\' or \'-1\'');
  }
  const query = Task.findOne({
    _id: taskId,
    'answers._id': answerId,
  });
  query.select('answers.$.votes');
  const result = yield query.exec();

  if (!result) {
    throw new NotFoundError(`Unable to find an answer with taskId='${taskId} and answerId='${answerId}'`);
  }

  const existingVoteForUserIndex = result.answers[0].votes.list.findIndex(userRating => userRating.user._id.toString() === user._id);


  let updateQuery;
  let newRating = result.answers[0].votes.rating;
  if (existingVoteForUserIndex === -1) {
    if (voteValue === '-1') {
      newRating -= 1;
    } else {
      newRating += 1;
    }
    updateQuery = Task.findOneAndUpdate({
      _id: taskId,
      'answers._id': answerId,
    },
    {
      $set: {
        'answers.$.votes.rating': newRating,
      },
      $push: {
        'answers.$.votes.list': {
          user,
          rating: voteValue,
        },
      },
    });
  } else if (result.answers[0].votes.list[existingVoteForUserIndex].rating !== ~~voteValue) {
    if (voteValue === '-1') {
      newRating -= 2;
    } else {
      newRating += 2;
    }
    result.answers[0].votes.list[existingVoteForUserIndex] = {
      user,
      rating: voteValue,
    };
    updateQuery = Task.findOneAndUpdate({
      _id: taskId,
      'answers._id': answerId,
    },
    {
      $set: {
        'answers.$.votes.rating': newRating,
        'answers.$.votes.list': result.answers[0].votes.list,
      },
    });
  }
  if (updateQuery) {
    yield updateQuery.exec();
  }

  return newRating;
};

const getAnswerUserRating = function* (taskId, answerId, userId) {
  return {
    rating: '+1',
  };
};

module.exports = {
  getTasks,
  getTask,
  getTasksNearMe,
  getUserTasks,
  addTask,
  getTasksByIds,
  addAnswer,
  vote,
  getAnswerUserRating,
};
