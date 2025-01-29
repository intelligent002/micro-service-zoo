import {ResultSetHeader, RowDataPacket} from 'mysql2';
import pool from './db';
import {Project} from "../types/project";

export class ProjectDAL {
    static async createProject(
        {
            name
        }: {
            name: string
        }
    ): Promise<Project> {
        try {
            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO projects
                 SET name       = ?,
                     created_at = NOW(),
                     updated_at = NOW()`,
                [name]
            );
            return this.getProjectById({id: result.insertId});
        } catch (error) {
            console.log('Failed to create project');
        }
    }

    static async getProjectById(
        {
            id
        }: {
            id: number
        }
    ): Promise<Project> {
        const project = await this.getProjectByIdOrNull({id});
        if (!project) {
            throw new Error(`Project with ID ${id} not found`);
        }
        return project;
    }

    static async getProjectByIdOrNull(
        {
            id
        }: {
            id: number
        }
    ): Promise<Project | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT id, name, created_at, updated_at
             FROM projects
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return {
            id: row.id,
            name: row.name,
            createdAt: new Date(row.created_at).toISOString(),
            updatedAt: new Date(row.updated_at).toISOString(),
        } as Project;
    }

    static async updateProject(
        {
            id,
            name
        }: {
            id: number;
            name: string
        }
    ): Promise<Project> {
        try {
            await pool.query(
                `UPDATE projects
                 SET name       = ?,
                     updated_at = NOW()
                 WHERE id = ?`,
                [name, id]
            );
            return this.getProjectById({id})
        } catch (error) {
            console.log('Failed to update project');
        }
    }

    static async deleteProject(
        {
            id
        }: {
            id: number
        }
    ): Promise<void> {
        try {
            await pool.query(
                `DELETE
                 FROM tasks
                 WHERE project_id = ?`, [id]);

            await pool.query(
                `DELETE
                 FROM projects
                 WHERE id = ?`, [id]);
        } catch (error) {
            console.log('Failed to delete project');
        }
    }

    static async listProjects(): Promise<Project[]> {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT id, name, created_at, updated_at
             FROM projects`
        );

        return rows.map((row) => ({
            id: row.id,
            name: row.name,
            createdAt: new Date(row.created_at).toISOString(),
            updatedAt: new Date(row.updated_at).toISOString(),
        } as Project));
    }
}
