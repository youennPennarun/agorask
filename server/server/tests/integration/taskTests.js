/* global describe, it */
const expect = require('chai').expect;
const co = require('co');
const fetch = require('node-fetch');
const { Venue } = require('../data');

const TOKEN = process.env.TEST_TOKEN;
const USERNAME = process.env.TEST_USERNAME;


describe('Tasks Tests', () => {
  describe('add a task', () => {
    it('Should send the complete task back', () => {
      const task = {
        title: 'Task integration test 1',
        venueId: Venue[3]._id,
      };

      return co(function* () {
console.log(`http://localhost:3000/tasks?token=${TOKEN}`)
        const response = yield fetch(`http://localhost:3000/tasks?token=${TOKEN}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        });
        expect(response.status).to.be.equal(200);
        const json = yield response.json();
        expect(json).to.have.property('title', task.title);
        expect(json).to.have.property('venue', task.venueId);
        expect(json).to.have.property('postedBy');
        expect(json.postedBy).to.have.property('userId');
        expect(json.postedBy).to.have.property('username', USERNAME);
        expect(json).to.have.property('date');
      });
    });

    it('Should require a token', () => {
      const task = {
        title: 'Task integration test 2',
        venueId: Venue[3]._id,
      };

      return co(function* () {
        const response = yield fetch(`http://localhost:3000/tasks`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        });
        expect(response.status).to.be.equal(401);
        expect(response.statusText).to.be.equal('Unauthorized');
      });
    });

    it('Should throw a bad request if the title is missing', () => {
      const task = {
        venueId: Venue[3]._id,
      };

      return co(function* () {
        const response = yield fetch(`http://localhost:3000/tasks?token=${TOKEN}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        });
        expect(response.status).to.be.equal(400);
        expect(response.statusText).to.be.equal('Bad Request');
        const json = yield response.json();
        expect(json).to.be.deep.equal({
          statusCode: 400,
          status: 'Bad Request',
          message: 'Invalid title',
        });
      });
    });

    it('Should throw a bad request if the venue id is missing', () => {
      const task = {
        title: 'Task integration test 4',
      };

      return co(function* () {
        const response = yield fetch(`http://localhost:3000/tasks?token=${TOKEN}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        });
        expect(response.status).to.be.equal(400);
        expect(response.statusText).to.be.equal('Bad Request');
        const json = yield response.json();
        expect(json).to.be.deep.equal({
          statusCode: 400,
          status: 'Bad Request',
          message: 'Invalid venue id',
        });
      });
    });
  });
});
