// Define the shape of a Task entity
export interface Task {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

// Define the structure of the GraphQL query response
export interface GetTasksData {
    getTasks: Task[];
}
