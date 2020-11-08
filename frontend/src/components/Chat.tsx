import React, { Component } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import {Container, Segment, Input} from 'semantic-ui-react'

const URL = 'ws://localhost:8000';

export interface Message {
  name: string,
  message: string,
}
interface ChatState {
  name: string,
  messages: Message[],
  ws?: WebSocket,
}

class Chat extends Component<{}, ChatState> {
  state = {
    name: 'Bob',
    messages: new Array<Message>(),
  }

  ws = new WebSocket(URL)

  componentDidMount() {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected')
    }

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      console.log(evt.data);
      const message = JSON.parse(evt.data)
      this.addMessage(message)
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL),
      })
    }
  }

  addMessage = (message: Message) =>
    this.setState(state => ({ messages: [message, ...state.messages] }))

  submitMessage = (messageString: string) => {
    // on submitting the ChatInput form, send the message, add it to the list and reset the input
    const message: Message = { name: this.state.name, message: messageString }
    this.ws.send(JSON.stringify(message))
    this.addMessage(message)
  }

  render() {
    return (
      <Container>
        <Segment.Group>
          <Segment>
            <Input
              label="name"
              type="text"
              id={'name'}
              placeholder={'Enter your name...'}
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
            />
          </Segment>
          <Segment>
            <ChatInput
              ws={this.ws}
              onSubmitMessage={messageString => this.submitMessage(messageString)}
            />
          </Segment>
          {this.state.messages.map((message, index) =>
            <Segment>
              <ChatMessage
                key={index}
                message={message.message}
                name={message.name}
              />
            </Segment>,
          )}
        </Segment.Group>
      </Container>
    )
  }
}

export default Chat
