import React from 'react';
import {Message} from './Chat';

export default (message: Message) => {
  return <p>
    <strong>{message.name}</strong> <em>{message.message}</em>
  </p>
}
