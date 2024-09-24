// Define the shape of a Task entity
export interface Task {
    id: number;
    name: string;
    rawId: number;
}

// Define the structure of the GraphQL query response
export interface GetTasksData {
    getTasks: Task[];
}