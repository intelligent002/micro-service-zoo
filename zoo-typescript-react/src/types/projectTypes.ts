// Define the shape of a Project entity
export interface Project {
    id: string;
    name: string;
    rawId: number;
    __typename: string;
}

// Define the structure of the GraphQL query response
export interface GetProjectsData {
    getProjects: Project[];
}