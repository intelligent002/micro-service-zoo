// src/app/tasks/page.js

import client from '../../lib/apolloClient';
import { GET_TASKS } from '../../lib/queries';

export async function generateStaticParams() {
    const { data } = await client.query({
        query: GET_TASKS,
    });

    return data.tasks.map(task => ({
        taskId: task.id, // Assuming you have a dynamic route for tasks, such as [taskId]
    }));
}

export default async function TasksPage() {
    const { data } = await client.query({
        query: GET_TASKS,
    });

    const tasks = data.tasks;

    return (
        <div>
            <h1>Tasks List</h1>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <strong>{task.name}</strong> (Project: {task.project.name})<br />
                        Created: {new Date(task.createdAt).toLocaleDateString()}<br />
                        Updated: {new Date(task.updatedAt).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}
