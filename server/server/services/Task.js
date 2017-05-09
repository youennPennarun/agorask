const {Task, Venue} = require('../utils/mongo/models');
const mongoose = require('mongoose');
const Firebase = require('./Firebase');

const {NotFoundError} = require('../utils/errors');

const getTasks = async function (offset = 0, limit = 5) {
  return Task.find({})
          .skip(offset)
          .limit(limit)
          .sort({date: -1})
          .exec();
};

const getTasksNearMe = async function ({latitude, longitude}, radiusMeters, userId, fields) {
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

  return query.exec();
};

const getTask = async function (id, userId, fields) {
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
  return query.exec();
};

const getTasksPostedByUser = async function (userId, fields, options = {}) {
  const fetchQuery = Task.find({'postedBy.userId': userId});
  const countQuery = Task.count({'postedBy.userId': userId});
  if (fields) {
    fetchQuery.select(fields);
  }
  const {limit = 5, offset = 0} = options;
  fetchQuery.skip(offset).limit(limit);
  return {
    total: await countQuery.exec(),
    tasks: await fetchQuery.exec(),
  };
};

const getUserRating = async function (answerId, userId) {
  const result = await Task.aggregate([
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

const getTasksByIds = async function (ids, fields) {
  const query = Task.find({
    _id: { $in: ids},
  });
  if (fields) {
    query.select(fields);
  }
  return query.exec();
};

const getUserTasks = async function (username, offset = 0, limit = 10, fields) {
  if (fields && !(fields instanceof Array)) {
    fields = Object.keys(fields);
  }
  if (fields) {
    fields.push('postedBy.username');
  }
  const query = Task.find({'postedBy.username': username})
          .skip(offset)
          .limit(limit)
          .sort({_id: -1})
  if (fields) {
    query.select(fields);
  }
  return query.exec();
};

const addTask = async function (title, venueId, {_id: userId, username}, date) {
  if (!title) throw new Error('invalid title');
  if (!venueId) throw new Error('invalid venueId');
  if (!userId) throw new Error('invalid user._id');
  if (!username) throw new Error('invalid user.username');

  if (!date) {
    date = new Date();
  }
  const venue = await Venue.findOne({_id: venueId}).exec();
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
  const task = await taskData.save();
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
  await venue.save();
  return task;
};

const addAnswer = async function (taskId, answer, fields) {
  answer._id = new mongoose.mongo.ObjectId();
  answer.date = new Date();
  answer.rating = 0;
  answer.ratingList = [];

  const query = Task.findByIdAndUpdate(
    taskId,
    {$push: {answers: answer}}
  );
  if (fields) {
    fields.postedBy = 1;
    fields.title = 1;
    query.select(fields);
  }
  const response = await query.exec();
  response.title = response.title || '';

  Firebase.sendMessage(response.postedBy.userId, {
    notification: {
      title: 'Agorask',
      body: `An answer have been posted on your task: ${response.title}`,
      sound: 'default',
    },
    data: {
      taskId: taskId,
    },
  });
  if (response) {
    return answer;
  }
  return null;
};

const vote = async function (taskId, answerId, user, voteValue) {
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
  const result = await query.exec();

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
    await updateQuery.exec();
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
  getTasksPostedByUser,
};
