/* global describe, it */
const expect = require('chai').expect;
const co = require('co');
const { Venue, Task } = require('../data');

const {addTask, getTask} = require('./queries/tasks');
const {addAnswer} = require('./queries/answer');

const fetchQL = require('./graphFetch');

const TOKEN = process.env.TEST_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1bW1lciIsImlhdCI6MTQ3ODA5MjAxNn0.Tcy-ZLrEv5mhbk5JcTsWXxAvjzjlUEwxR-RwGY4Ork8';

const USERNAME = process.env.TEST_USERNAME;


describe('Tasks Tests', () => {
  describe('add a task', () => {
    it('Should send the complete task back', () => {
      const params = {
        task: {
          title: 'Task integration test 1',
        },
        venueId: Venue[3]._id,
        token: TOKEN,
      };
      return co(function* () {
        const response = yield fetchQL(addTask, params);
        expect(response.status).to.be.equal(200);
        return response.json();
      }).then(({data: json}) => {
        expect(json.task).to.have.property('title', params.task.title);
        expect(json.task).to.have.property('postedBy');
        expect(json.task.postedBy).to.have.property('userId');
        expect(json.task.postedBy).to.have.property('username', USERNAME);
        expect(json.task).to.have.property('date');
      });
    });

    it('Should require a token', () => {
      const params = {
        title: 'Task integration test 2',
        venueId: Venue[3]._id,
      };

      return co(function* () {
        const response = yield fetchQL(addTask, params);
        expect(response.status).to.be.equal(400);
      });
    });

    it('Should throw an error if the title is missing', () => {
      const params = {
        venueId: Venue[3]._id,
        token: TOKEN,
      };

      return co(function* () {
        const response = yield fetchQL(addTask, params);
        expect(response.statusText).to.be.equal('Bad Request');
        const json = yield response.json();
        expect(json).to.be.deep.equal({
            errors: [
            {
              locations: [
                {
                  column: 35,
                  line: 2,
                },
              ],
              message: 'Variable "$task" of required type "TaskInput!" was not provided.',
            },
          ],
        });
      });
    });

    it('Should throw a bad request if the venue id is missing', () => {
      const params = {
        title: 'Task integration test 4',
        token: TOKEN,
      };

      return co(function* () {
        const response = yield fetchQL(addTask, params);
        expect(response.statusText).to.be.equal('Bad Request');
        const json = yield response.json();
        expect(json).to.be.deep.equal({
          errors: [
            {
              locations: [
                {
                  column: 20,
                  line: 2,
                },
              ],
              message: 'Variable "$venueId" of required type "ID!" was not provided.',
            },
          ],
       });
      });
    });
  });

  describe('add an answer', () => {
    it('Should be able to answer a task', () => {
      const params = {
        taskId: Task[0]._id,
        answer: {
          answer: 'An answer from a test!',
        },
        token: TOKEN,
      };
      return co(function* () {
        const response = yield fetchQL(addAnswer, params);

        expect(response.status).to.be.equal(200);
        return response.json();
      }).then(({data, errors}) => {
        if (errors) {
          throw new Error(JSON.stringify(errors));
        }

        expect(data).to.have.property('answer');
        expect(data.answer).to.have.property('answer', params.answer.answer);
        expect(data.answer).to.have.property('postedBy');
        expect(data.answer.postedBy).to.have.property('username', 'unity');
      }).then(() => co(function* () {
        const response = yield fetchQL(getTask, {id: params.taskId});

        expect(response.status).to.be.equal(200);
        return response.json();
      }));
    });
  });
});
