import sqlite3 from 'sqlite3';
import dayjs from 'dayjs';
import path from 'path';

export default class TodosRepository {
  db: sqlite3.Database

  constructor() {
    dayjs().format();
    let dbPath = path.join(__dirname, '/../db/sqlite.db');
    this.db = new sqlite3.Database(`${dbPath}`);
  }

  createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT,
        name TEXT,
        dueDate DATETIME,
        isComplete BOOLEAN
    )`
    this.db.run(query);
  }

  addRow(task: string, name: string, dueDate: dayjs.Dayjs, isComplete: boolean) {
    const query = `
      INSERT INTO todos (task, name, dueDate, isComplete) VALUES (?, ?, ?, ?)
    `;
    console.log(`${task} ${name} ${dueDate} ${isComplete}`);
    this.db.run(
      query,
      [task, name, dueDate, isComplete],
      function(err: Error) {
        if (err) {
          // do something with the error
        }
      });
  }

  getAllRows(rowCallback: (row: any) => void) {
    const query = `SELECT * FROM todos`;
    this.db.all(query, (err, rows) => {
      if (err) {
        // do something with the error
      }
      rows.forEach(row => rowCallback(row));
    });
  }

  getExpiredRows(rowCallback: (row: any) => void) {
    const currentDateTime = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');
    const query = `SELECT * FROM todos WHERE dueDate <= '${currentDateTime}'`;
    console.log(query);
    this.db.all(query, (err, rows) => {
      if (err) {
        // do something with the error
      }
      rows.forEach(row => rowCallback(row));
    });
  }
}
