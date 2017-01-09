/* global jest, expect, describe, it */

import 'react-native';
import React from 'react';

import {TaskDetails} from '../src/components/views/taskDetails/TaskDetails';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

it('renders correctly', () => {
  const wrapper = shallow(
    <TaskDetails loading={false}
      id='5834b73cb5cb2c65d95f7ceb'
      task={{
        name: 'Test Venue',
        title: 'Help me!',
        date: new Date('Wed Nov 23 2016 00:36:54 GMT+0000 (GMT)'),
        answers: [
          {
            answer: 'No can do',
            postedBy: {
              username: 'Joe',
            },
            date: new Date('Wed Nov 23 2016 00:36:54 GMT+0000 (GMT)'),
          },
        ],
      }} />
  );
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});

it('fetching renders correctly', () => {
  const wrapper = shallow(
    <TaskDetails loading
      id='5834b73cb5cb2c65d95f7ceb'
      task={{
        name: 'Test Venue',
        title: 'Help me!',
        date: new Date('Wed Nov 23 2016 00:36:54 GMT+0000 (GMT)'),
        answers: [
          {
            answer: 'No can do',
            postedBy: {
              username: 'Joe',
            },
            date: new Date('Wed Nov 23 2016 00:36:54 GMT+0000 (GMT)'),
          },
        ],
      }} />
  );
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});

it('fetching renders correctly if there is no answers', () => {
  const wrapper = shallow(
    <TaskDetails loading
      id='5834b73cb5cb2c65d95f7ceb'
      task={{
        name: 'Test Venue',
        title: 'Help me!',
        date: new Date('Wed Nov 23 2016 00:36:54 GMT+0000 (GMT)'),
      }} />
  );
  expect(shallowToJson(wrapper)).toMatchSnapshot();
});

it('Call add answer', () => {
  const addAnswer = jest.fn();
  const wrapper = shallow(
    <TaskDetails loading
      id='5834b73cb5cb2c65d95f7ceb'
      task={{
        name: 'Test Venue',
        title: 'Help me!',
        date: new Date('Wed Nov 23 2016 00:36:54 GMT+0000 (GMT)'),
        answers: [
          {
            answer: 'No can do',
            postedBy: {
              username: 'Joe',
            },
            date: new Date('Wed Nov 23 2016 00:36:54 GMT+0000 (GMT)'),
          },
        ],
      }} 
      addAnswer={addAnswer}/>
  );
  wrapper.find('Connect(AddAnswer)').at(0).props().addAnswer();
  expect(addAnswer.mock.calls.length).toBe(1);
});
