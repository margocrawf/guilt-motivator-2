import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'semantic-ui-react'
import ITask from '../interfaces/ITask'

interface TaskInputProps {
  ws: WebSocket,
  onSubmitMessage: (taskState: ITask) => void,
}

interface TaskInputState {
  name: string,
  message: string,
  secondsToExpiration: string,
}

class TaskInput extends Component<TaskInputProps, TaskInputState> {

  static propTypes = {
    onSubmitMessage: PropTypes.func.isRequired,
  }

  state = {
    message: '',
    name: '',
    secondsToExpiration: '',
  }

  extractFloat = (numString: string): number => {
    return parseFloat(numString)
  }

  render() {
    return (
      <Form
        action="."
        onSubmit={e => {
          e.preventDefault()
          if (this.state.message !== "" && this.state.name !== "" && !isNaN(this.extractFloat(this.state.secondsToExpiration))) {
            this.props.onSubmitMessage({...this.state, secondsToExpiration: this.extractFloat(this.state.secondsToExpiration)})
            this.setState({ message: '', secondsToExpiration: '' })
          }
        }}
      >
        <Form.Input
          label="Name"
          type="text"
          placeholder={'Enter name...'}
          value={this.state.name}
          onChange={e => this.setState({ name: e.target.value })}
        />
        <Form.Input
          label="Task"
          type="text"
          placeholder={'Enter task...'}
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}
        />
        <Form.Input
          label="Time to expiration (seconds)"
          type="number"
          placeholder={'Time to expiration...'}
          value={this.state.secondsToExpiration}
          error={(this.state.secondsToExpiration !== "" && isNaN(parseFloat(this.state.secondsToExpiration)))}
          onChange={e => this.setState({ secondsToExpiration: e.target.value})}
        />
        <Button type="submit">Enter</Button>
      </Form>
    )
  }
}

export default TaskInput
