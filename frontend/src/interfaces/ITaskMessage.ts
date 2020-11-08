import dayjs from 'dayjs';

export default interface ITaskMessage {
  name: string,
  task: string,
  dueDate: dayjs.Dayjs,
  isComplete: boolean,
}
