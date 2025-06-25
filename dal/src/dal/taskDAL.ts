import pool from './db';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Task} from "../types/task";

export class TaskDAL {
    static async createTask(
        {
            projectId,
            name
        }: {
            projectId: number,
            name: string,
        }
    ): Promise<Task> {
        try {
            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO tasks
                 SET name       = ?,
                     project_id = ?,
                     created_at = NOW(),
                     updated_at = NOW()`,
                [name, projectId]
            );
            return this.getTaskById({id: result.insertId});
        } catch (error) {
            console.log('Failed to create task');
        }
    }

    static async getTaskById(
        {
            id
        }: {
            id: number
        }
    ): Promise<Task> {
        const task = await this.getTaskByIdOrNull({id});
        if (!task) {
            throw new Error(`Task with ID ${id} not found`);
        }
        return task;
    }

    static async getTaskByIdOrNull(
        {
            id
        }: {
            id: number
        }
    ): Promise<Task | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT id, project_id, name, created_at, updated_at
             FROM tasks
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return {
            id: row.id,
            projectId: row.project_id,
            name: row.name,
            createdAt: new Date(row.created_at).toISOString(),
            updatedAt: new Date(row.updated_at).toISOString(),
        } as Task;
    }

    static async migrateTask(
        {
            taskId,
            newProjectId
        }: {
            taskId: number,
            newProjectId: number,
        }
    ): Promise<Task> {
        try {
            await pool.query(
                `UPDATE tasks
                 SET project_id = ?,
                     updated_at = NOW()
                 WHERE id = ?`,
                [newProjectId, taskId]
            );
            return this.getTaskById({id: taskId});
        } catch (error) {
            console.log('Failed to migrate task');
        }
    }

    static async deleteTask(
        {
            id
        }: {
            id: number
        }
    ): Promise<void> {
        try {
            await pool.query(`DELETE
                              FROM tasks
                              WHERE id = ?`, [id]);
        } catch (error) {
            console.log('Failed to delete a task');
        }
    }

    static async listTasksByProject(
        {
            projectId
        }: {
            projectId: number
        }
    ): Promise<Task[]> {
        try {
            const [rows] = await pool.query<RowDataPacket[]>(
                `SELECT id, project_id, name, created_at, updated_at
                 FROM tasks
                 WHERE project_id = ?`,
                [projectId]
            );

            return rows.map((row) => ({
                id: row.id,
                name: row.name,
                projectId: row.project_id,
                createdAt: new Date(row.created_at).toISOString(),
                updatedAt: new Date(row.updated_at).toISOString(),
            } as Task));
        } catch (error) {
            console.log('Failed to list tasks');
        }
    }
}
