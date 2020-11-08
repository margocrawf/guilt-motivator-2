import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Segment } from 'semantic-ui-react'

interface ChatInputProps {
  ws: WebSocket,
  onSubmitMessage: (message: string) => void,
}
interface ChatInputState {
  message: string
};

class ChatInput extends Component<ChatInputProps, ChatInputState> {
  static propTypes = {
    onSubmitMessage: PropTypes.func.isRequired,
  }
  state = {
    message: '',
  }

  render() {
    return (
      <form
        action="."
        onSubmit={e => {
          e.preventDefault()
          this.props.onSubmitMessage(this.state.message)
          this.setState({ message: '' })
        }}
      >
        <Input
          type="text"
          placeholder={'Enter message...'}
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}
        />
        <Input type="submit" value={'Send'} />
      </form>
    )
  }
}

export default ChatInput
