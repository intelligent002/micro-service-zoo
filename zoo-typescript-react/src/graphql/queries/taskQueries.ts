import { gql } from '@apollo/client';

export const GET_TASKS = gql`
    query getTasks($projectId: Int!) {
        getTasks(projectId: $projectId) {
            id
            name
            rawId
            projectId
        }
    }
`;