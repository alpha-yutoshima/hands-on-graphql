import { ResultSetHeader, RowDataPacket, QueryResult } from "mysql2";
import { ulid } from "ulid";
import { connect } from "../database";
import { Task, toTask } from "../model";

interface ITask extends ResultSetHeader {
  task_id: string;
  category_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export async function taskList() {
  try {
    const connection = await connect();

    return await new Promise<Task[]>((resolve, reject) => {
      const sql = `
      SELECT * 
      FROM task
      ORDER BY created_at DESC
      `;

      connection.query<ITask[]>(sql, [], (err, result) => {
        if (err) {
          return reject(err);
        }

        const tasks = result.map((t: ITask) =>
          toTask(
            t.task_id,
            t.category_id,
            t.title,
            t.description,
            t.created_at,
            t.updated_at
          )
        );

        resolve(tasks);
      });
    });
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get task list.");
  }
}

interface CreateTaskArgs {
  title: string;
  description: string;
}

export async function createTask(
  _: any,
  { title, description }: CreateTaskArgs
) {
  try {
    const connection = await connect();
    const taskId = ulid();

    return await new Promise<void>((resolve, reject) => {
      const sql = `
      INSERT 
      INTO task(task_id, title, description)
      VALUES(?, ?, ?)
      `;

      connection.query<ITask>(sql, [taskId, title, description], (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  } catch (e) {
    console.error(e);
    throw new Error("Failed to create task.");
  }
}

interface SearchTaskArgs {
  title: string;
  description: string;
}

export async function searchTask(
  _: any,
  { title, description }: SearchTaskArgs
) {
  try {
    const connection = await connect();

    return await new Promise<Task[]>((resolve, reject) => {
      const sql = `
      SELECT * 
      FROM task
      WHERE title LIKE ?
      OR description LIKE ?
      ORDER BY created_at DESC
      `;

      connection.query<ITask[]>(sql, [`%${title}%`, `%${description}%`], (err, result) => {
        if (err) {
          return reject(err);
        }

        const tasks = result.map((t: ITask) =>
          toTask(
            t.task_id,
            t.category_id,
            t.title,
            t.description,
            t.created_at,
            t.updated_at
          )
        );

        resolve(tasks);
      });
    });
  } catch (e) {
    console.error(e);
    throw new Error("Failed to search task.");
  }
}
