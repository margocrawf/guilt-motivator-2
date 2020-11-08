import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import dayjs from 'dayjs';
import TodosRepository from './TodosRepository';

interface ITaskMessage {
  name: string,
  task: string,
  dueDate: dayjs.Dayjs,
  isComplete: boolean,
}

const getTodoRowCallback = (ws: WebSocket) => (row) => {
  ws.send(JSON.stringify(row));
};

const getExpiredRowCallback = (row) => {
  console.log(JSON.stringify(row));
}

const app = express();
const wsPort = 8000;

const server = http.createServer(app);
server.listen(wsPort);
const wss = new WebSocket.Server({server});

const messages: ITaskMessage[] = [];

const todosRepository: TodosRepository = new TodosRepository();
todosRepository.createTable();

todosRepository.getExpiredRows(getExpiredRowCallback);

console.log(`backend listening on port ${wsPort}`);

wss.on('connection', (ws: WebSocket) => {
  todosRepository.getAllRows(getTodoRowCallback(ws));
  ws.on('message', (data: string) => {
    console.log(`message received: ${data}`);
    try {
      const jsonMessage = JSON.parse(data);
      const message = jsonMessage as ITaskMessage;
      messages.push(message);
      todosRepository.addRow(message.task, message.name, message.dueDate, message.isComplete);
    } catch (e) {
      console.log(e.message);
    }
  })
});
