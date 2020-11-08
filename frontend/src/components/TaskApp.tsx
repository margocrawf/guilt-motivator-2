import React, { Component } from 'react'
import dayjs from 'dayjs';
import TaskInput from './TaskInput'
import TaskDisplay from './TaskDisplay'
import {Container, Segment, Input} from 'semantic-ui-react'
import ITask from '../interfaces/ITask'
import ITaskMessage from '../interfaces/ITaskMessage'

const URL = 'ws://localhost:8000';

interface TaskState {
  name: string,
  messages: ITaskMessage[],
  ws?: WebSocket,
}

class TaskApp extends Component<{}, TaskState> {
  state = {
    name: 'Bob',
    messages: new Array<ITaskMessage>(),
  }

  ws = new WebSocket(URL)

  componentDidMount() {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected')
    }

    this.ws.onmessage = (evt) => {
      // on receiving a message, add it to the list of messages
      console.log(evt.data);
      const jsonMessage = JSON.parse(evt.data);
      try {
        const message = jsonMessage as ITaskMessage;
        this.addMessage(message);
      } catch (e) {
        console.log(e.message);
      }
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL),
      })
    }
  }

  convertToDueDate = (secondsToExpiration: number): dayjs.Dayjs => {
    const currentDateTime = dayjs();
    return currentDateTime.add(secondsToExpiration, 'second');
  }

  addMessage = (message: ITaskMessage) => {
    console.log(message);
    this.setState(state => ({ messages: [message, ...state.messages] }));
  }

  submitMessage = (taskInput: ITask) => {
    // on submitting the TaskInput form, send the message, add it to the list and reset the input
    const message: ITaskMessage = { name: taskInput.name, task: taskInput.message, dueDate: this.convertToDueDate(taskInput.secondsToExpiration || 0), isComplete: false }
    this.ws.send(JSON.stringify(message));
    this.addMessage(message);
  }

  render() {
    return (
      <Container>
        <Segment.Group>
          <Segment>
            <TaskInput
              ws={this.ws}
              onSubmitMessage={(taskInput: ITask) => this.submitMessage(taskInput)}
            />
          </Segment>
          {this.state.messages.map((message, index) =>
            <Segment>
              <TaskDisplay
                key={index}
                task={message.task}
                name={message.name}
                dueDate={message.dueDate}
                isComplete={message.isComplete}
              />
            </Segment>,
          )}
        </Segment.Group>
      </Container>
    )
  }
}

export default TaskApp
