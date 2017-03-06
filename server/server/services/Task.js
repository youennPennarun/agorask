const {Task, Venue} = require('../utils/mongo/models');
var mongoose = require('mongoose');

const {NotFoundError} = require('../utils/errors');

const getTasks = function* (offset = 0, limit = 5) {
  const tasks = yield Task.find({})
          .skip(offset)
          .limit(limit)
          .sort({date: -1})
          .exec();
  return tasks;
};

const getTasksNearMe = function* ({latitude, longitude}, radiusMeters, userId, fields) {
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

  const query = Task.find({
    $and: andQuery,
  });
  if (fields) {
    query.select(fields);
  }

  return yield query.exec();
};

const getTask = function* (id, userId, fields) {
  if (fields && !(fields instanceof Array)) {
    fields = Object.keys(fields);
  }
  if (fields) {
    fields.push('answers._id');
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
  return yield query.exec();
};

const getUserRating = function* (answerId, userId) {
  const result = yield Task.aggregate([
    {
      $unwind: {
        path: '$answers',
      },
    },
    {
      $match: {
        'answers._id': answerId,
      },
    },
    {
      $unwind: {
        path: '$answers.ratingList',
      },
    },
    {
      $project: {
        'answers.ratingList': 1,
      },
    },
    {
      $match: {
        'answers.ratingList.user._id': new mongoose.mongo.ObjectId(userId),
      },
    },
  ]).exec();
  if (result.length) {
    return result[0].answers.ratingList;
  }
  return null;
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
  query.select('answers.$');
  const result = yield query.exec();

  if (!result) {
    throw new NotFoundError(`Unable to find an answer with taskId='${taskId} and answerId='${answerId}'`);
  }

  const existingVoteForUserIndex = result.answers[0].ratingList.findIndex(userRating => userRating.user._id.toString() === user._id);


  let updateQuery;
  let newRating = result.answers[0].rating;
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
        'answers.$.rating': newRating,
      },
      $push: {
        'answers.$.ratingList': {
          user,
          rating: voteValue,
        },
      },
    });
  } else if (result.answers[0].ratingList[existingVoteForUserIndex].rating !== ~~voteValue) {
    if (voteValue === '-1') {
      newRating -= 2;
    } else {
      newRating += 2;
    }
    result.answers[0].ratingList[existingVoteForUserIndex] = {
      user,
      rating: voteValue,
    };
    updateQuery = Task.findOneAndUpdate({
      _id: taskId,
      'answers._id': answerId,
    },
    {
      $set: {
        'answers.$.rating': newRating,
        'answers.$.ratingList': result.answers[0].ratingList,
      },
    });
  }
  if (updateQuery) {
    yield updateQuery.exec();
  }

  return newRating;
};

module.exports = {
  getTasks,
  getTask,
  getUserRating,
  getTasksNearMe,
  getUserTasks,
  addTask,
  getTasksByIds,
  addAnswer,
  vote,
};
