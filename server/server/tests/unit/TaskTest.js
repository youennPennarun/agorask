/* global describe it */
/* eslint-disable no-unused-expressions */

const chai = require('chai');
const co = require('co');
const path = require('path');
const taskData = require('../data').Task;
const userData = require('../data').User;
const venueData = require('../data').Venue;
const Task = require('../../services/Task');

const snapshot = require('chai-jest-snapshot');

const expect = chai.expect;
chai.use(snapshot);

const cleanMongooseObject = require('../cleanMongooseObject');

describe('Tasks', function () {
  describe('Get tasks', function() {
    const snapshotPath = path.join(__dirname, '/__snaps__/tasks/getTasks.snap');

    it('Should return 3 tasks', function() {
      return co(Task.getTasks(0, 3))
        .then(tasks => {
          expect(tasks).to.matchSnapshot(snapshotPath, this.test.title);
        }).catch(e => {
          throw e;
        });
    });

    it('Should return 2 tasks skipping the three first', function () {
      return co(Task.getTasks(3, 2))
        .then(tasks => {
          expect(tasks).to.matchSnapshot(snapshotPath, this.test.title);
        }).catch(e => {
          throw e;
        });
    });
  });
  describe('Get task by Id', function () {
    const snapshotPath = path.join(__dirname, '/__snaps__/tasks/getTask.snap');
    it(`Should return the task corresponding to the ID ${taskData[2]._id} if it exist`, function () {
      return co(Task.getTask(taskData[2]._id))
        .then(task => {
          expect(task).to.matchSnapshot(snapshotPath, this.test.title);
        }).catch(e => {
          throw e;
        });
    });
  });
  describe('Get user tasks', function () {
    const snapshotPath = path.join(__dirname, '/__snaps__/tasks/getUserTasks.js');
    it('Should return a user tasks - test 1', function () {
      return co(Task.getUserTasks(userData[0].username))
        .then(tasks => {
          expect(tasks).to.matchSnapshot(snapshotPath, this.test.title);
        }).catch(e => {
          throw e;
        });
    });

    it('Should return a user tasks - test 2', function () {
      return co(Task.getUserTasks(userData[5].username))
        .then(tasks => {
          expect(tasks).to.matchSnapshot(snapshotPath, this.test.title);
        }).catch(e => {
          throw e;
        });
    });
  });

  describe('Add a task', function () {
    const snapshotPath = path.join(__dirname, '/__snaps__/tasks/addTask.snap');
    it('Should add a task', function () {
      const user = {
        _id: userData[5]._id,
        username: userData[5].username,
      };
      const title = 'Task test 1';
      const venueId = venueData[2]._id;
      const date = new Date();
      return co(Task.addTask(title, venueId, user, date))
        .then(task => {
          task = task.toObject();
          expect(task).to.have.property('date');
          expect(task).to.have.property('_id');
          task._id = '[some id]';
          task.date = '[dome date]';
          expect(task).to.matchSnapshot(snapshotPath, this.test.title);
        });
    });
    it('Should throw an error if the user is missing the id', function () {
      const user = {
        username: userData[5].username,
      };
      const title = 'Task test 2';
      const venueId = venueData[2]._id;
      const date = new Date();
      return co(Task.addTask(title, venueId, user, date))
        .then(() => {
          throw new Error('Should have thrown an error');
        }).catch(e => {
          expect(e).to.matchSnapshot(snapshotPath, this.test.title);
        });
    });
    it('Should throw an error if the user is missing the username', function () {
      const user = {
        _id: userData[5]._id,
      };
      const title = 'Task test 2';
      const venueId = venueData[2]._id;
      const date = new Date();
      return co(Task.addTask(title, venueId, user, date))
        .then(() => {
          throw new Error('Should have thrown an error');
        }).catch(e => {
          expect(e).to.matchSnapshot(snapshotPath, this.test.title);
        });
    });
    it('Should throw an error if the title is missing', function () {
      const user = {
        _id: userData[5]._id,
        username: userData[5].username,
      };
      const title = undefined;
      const venueId = venueData[2]._id;
      const date = new Date();
      return co(Task.addTask(title, venueId, user, date))
        .then(() => {
          throw new Error('Should have thrown an error');
        }).catch(e => {
          expect(e).to.have.property('message', 'invalid title');
        });
    });
    it('Should throw an error if the venue id is missing', function () {
      const user = {
        _id: userData[5]._id,
        username: userData[5].username,
      };
      const title = 'Task test 4';
      const venueId = undefined;
      const date = new Date();
      return co(Task.addTask(title, venueId, user, date))
        .then(() => {
          throw new Error('Should have thrown an error');
        }).catch(e => {
          expect(e).to.have.property('message', 'invalid venueId');
        });
    });
  });
});
