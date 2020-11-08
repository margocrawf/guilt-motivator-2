export default interface ITask {
  name: string,
  message: string,
  secondsToExpiration: number | undefined,
}
