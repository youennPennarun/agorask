/* global describe it */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const co = require('co');
const taskData = require('../data').Task;
const userData = require('../data').User;
const Task = require('../../services/Task');

const cleanMongooseObject = require('../cleanMongooseObject');

describe('Tasks', () => {
  describe('Get tasks', () => {
    it('Should return 3 tasks', () => {
      return co(Task.getTasks(0, 3))
        .then(tasks => {
          expect(tasks).to.be.an.Array;
          expect(tasks).to.have.length(3);
          const cleaned = cleanMongooseObject(tasks);
          expect(cleaned).to.deep.equal(taskData.slice(0, 3));
        }).catch(e => {
          throw e;
        });
    });

    it('Should return 2 tasks skipping the three first', () => {
      return co(Task.getTasks(3, 2))
        .then(tasks => {
          expect(tasks).to.be.an.Array;
          expect(tasks).to.have.length(2);
          const cleaned = cleanMongooseObject(tasks);
          expect(cleaned).to.deep.equal(taskData.slice(3, 5));
        }).catch(e => {
          throw e;
        });
    });
  });
  describe('Get task by Id', () => {
    it('Should return the task corresponded to the given ID if it exist', () => {
      return co(Task.getTask(taskData[2]._id))
        .then(task => {
          const cleaned = cleanMongooseObject(task);
          expect(cleaned).to.deep.equal(taskData[2]);
        }).catch(e => {
          throw e;
        });
    });
  });
  describe('Get user tasks', () => {
    it('Should return a user tasks - test 1', () => {
      return co(Task.getUserTasks(userData[0].username))
        .then(tasks => {
          const cleaned = cleanMongooseObject(tasks);
          expect(cleaned).to.deep.equal(
            taskData.filter(task => task.postedBy.username === userData[0].username)
          );
        }).catch(e => {
          throw e;
        });
    });

    it('Should return a user tasks - test 2', () => {
      return co(Task.getUserTasks(userData[5].username))
        .then(tasks => {
          const cleaned = cleanMongooseObject(tasks);
          expect(cleaned).to.deep.equal(
            taskData.filter(task => task.postedBy.username === userData[5].username)
          );
        }).catch(e => {
          throw e;
        });
    });
  });

  describe('Add a task', () => {
    it ('Should work', () => {
      throw new Error('not implemented yet');
    });
  });
});
