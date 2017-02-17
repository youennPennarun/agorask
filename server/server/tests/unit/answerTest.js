/* global describe it */
/* eslint-disable no-unused-expressions, func-names, prefer-arrow-callback */

const chai = require('chai');
const co = require('co');
const path = require('path');
const taskData = require('../data').Task;
const userData = require('../data').User;
const Task = require('../../services/Task');

const mongoose = require('mongoose');

const snapshot = require('chai-jest-snapshot');

const expect = chai.expect;
chai.use(snapshot);

describe('Answer', function () {
  describe('Vote', function() {
    // const snapshotPath = path.join(__dirname, '/__snaps__/answers/vote.snap');

    it('Should throw \'TypeError\' is the username is missing', function() {
      const taskId = taskData[0]._id;
      const answerId = taskData[0].answers[0]._id;
      const user = {
        _id: userData[0]._id,
      };
      return co(Task.vote(taskId, answerId, user, '+1'))
        .then(() => {
          throw new Error('Should throw an \'Unauthorized\' error ');
        }).catch(e => {
          expect(e).to.have.property('name', 'TypeError');
          expect(e).to.have.property('message', 'User should have property _id and username');
        });
    });
    it('Should throw \'TypeError\' is the user\'s _id is missing', function() {
      const taskId = taskData[0]._id;
      const answerId = taskData[0].answers[0]._id;
      const user = {
        username: userData[0].username,
      };
      return co(Task.vote(taskId, answerId, user, '+1'))
        .then(() => {
          throw new Error('Should throw an \'TypeError\' error ');
        }).catch(e => {
          expect(e).to.have.property('name', 'TypeError');
          expect(e).to.have.property('message', 'User should have property _id and username');
        });
    });

    it('Should throw \'NotFound\' is the task id doesn\'t exists', function() {
      const taskId = mongoose.Types.ObjectId();
      const answerId = taskData[0].answers[0]._id;
      const user = {
        _id: userData[0]._id,
        username: userData[0].username,
      };
      return co(Task.vote(taskId, answerId, user, '+1'))
        .then(() => {
          throw new Error('Should throw an \'NotFound\' error ');
        }).catch(e => {
          expect(e).to.have.property('name', 'NotFound');
          expect(e).to.have.property('message',
            `Unable to find an answer with taskId='${taskId} and answerId='${answerId}'`);
        });
    });

    it('Should throw \'NotFound\' is the answer id doesn\'t exists', function() {
      const taskId = taskData[0]._id;
      const answerId = mongoose.Types.ObjectId();
      const user = {
        _id: userData[0]._id,
        username: userData[0].username,
      };
      return co(Task.vote(taskId, answerId, user, '+1'))
        .then(() => {
          throw new Error('Should throw an \'NotFound\' error ');
        }).catch(e => {
          expect(e).to.have.property('name', 'NotFound');
          expect(e).to.have.property('message', `Unable to find an answer with taskId='${taskId} and answerId='${answerId}'`);
        });
    });
    it('Should throw \'NotFound\' is the answer id isn\'t an answer of task with task id', function() {
      const taskId = taskData[0]._id;
      const answerId = taskData[1].answers[0]._id;
      const user = {
        _id: userData[0]._id,
        username: userData[0].username,
      };
      return co(Task.vote(taskId, answerId, user, '+1'))
        .then(() => {
          throw new Error('Should throw an \'NotFound\' error ');
        }).catch(e => {
          expect(e).to.have.property('name', 'NotFound');
          expect(e).to.have.property('message', `Unable to find an answer with taskId='${taskId} and answerId='${answerId}'`);
        });
    });
    it('Should vote +1', function() {
      const taskId = taskData[0]._id;
      const answerId = taskData[0].answers[0]._id;
      const user = {
        _id: userData[0]._id,
        username: userData[0].username,
      };
      return co(Task.vote(taskId, answerId, user, '+1'))
        .then(rating => {
          expect(rating).to.equal(1);
        }).catch(e => {
          throw e;
        });
    });
    it('Should update the vote', function() {
      const taskId = taskData[0]._id;
      const answerId = taskData[0].answers[0]._id;
      const user = {
        _id: userData[0]._id,
        username: userData[0].username,
      };
      return co(Task.vote(taskId, answerId, user, '-1'))
        .then(rating => {
          expect(rating).to.equal(-1);
        }).catch(e => {
          throw e;
        });
    });
    it('Should not change the rating if the vote is the same', function() {
      const taskId = taskData[0]._id;
      const answerId = taskData[0].answers[0]._id;
      const user = {
        _id: userData[0]._id,
        username: userData[0].username,
      };
      return co(Task.vote(taskId, answerId, user, '-1'))
        .then(rating => {
          expect(rating).to.equal(-1);
        }).catch(e => {
          throw e;
        });
    });
  });
});
