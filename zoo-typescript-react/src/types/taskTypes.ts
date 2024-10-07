// Define the shape of a Task entity
export interface Task {
    id: number;
    name: string;
    projectId: number;
    createdAt: string;
    updatedAt: string;
    __typename: string;
}

// Define the structure of the GraphQL query response
export interface GetTasksData {
    getTasks: Task[];
}
