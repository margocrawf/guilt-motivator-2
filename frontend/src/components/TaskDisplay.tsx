import React from 'react';
import ITaskMessage from '../interfaces/ITaskMessage';
import {Checkbox} from 'semantic-ui-react';

interface TaskDisplayState {
  isComplete: boolean
}

export default class TaskDisplay extends React.Component<ITaskMessage, TaskDisplayState> {
  state = {
    isComplete: this.props.isComplete
  }

  toggle = () => this.setState((state) => ({isComplete: !state.isComplete}))

  render() {
    return <p>
      <Checkbox
      checked={this.state.isComplete}
      label={`${this.props.task}  ${this.props.dueDate}`}
      onChange = {this.toggle}
      />
    </p>
  }
}
