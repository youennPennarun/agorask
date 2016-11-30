/* global describe it */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const co = require('co');
const taskData = require('../data').Task;
const userData = require('../data').User;
const venueData = require('../data').Venue;
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
    it('Should add a task', () => {
      const user = {
        _id: userData[5]._id,
        username: userData[5].username,
      };
      const title = 'Task test 1';
      const venueId = venueData[2]._id;
      const date = new Date();
      return co(Task.addTask(title, venueId, user, date))
        .then(task => {
          const cleaned = cleanMongooseObject(task);
          expect(task).to.have.property('_id');
          cleaned.date = new Date(cleaned.date);
          delete cleaned._id;
          expect(cleaned).to.deep.equal({
            title,
            postedBy: {
              userId: user._id,
              username: user.username,
            },
            answers: [],
            date: date,
            venue: venueId,
          });
        });
    });
    it('Should throw an error if the user is missing the id', () => {
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
          expect(e).to.have.property('message', 'invalid user._id');
        });
    });
    it('Should throw an error if the user is missing the username', () => {
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
          expect(e).to.have.property('message', 'invalid user.username');
        });
    });
    it('Should throw an error if the title is missing', () => {
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
    it('Should throw an error if the ven  ue id is missing', () => {
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
