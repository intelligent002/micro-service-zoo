// Define the shape of a Project entity
export interface Project {
    id: number;
    name: string;
    __typename: string;
}

// Define the structure of the GraphQL query response
export interface GetProjectsData {
    getProjects: Project[];
}