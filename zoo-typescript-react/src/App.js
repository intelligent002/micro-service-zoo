// src/App.js
import React, {useEffect, useState} from 'react';
import {ApolloProvider, gql, useQuery} from '@apollo/client';
import {getApolloClient} from './apollo-client';
import {BrowserRouter as Router} from 'react-router-dom';

// GraphQL Queries
const GET_PROJECTS = gql`
    query getProjects {
        getProjects {
            id
            name
            rawId
            __typename
        }
    }
`;

const GET_TASKS = gql`
    query getTasks($projectId: Int!) {
        getTasks(projectId: $projectId) {
            id
            name
            rawId
            __typename
        }
    }
`;

function ProjectsList({onSelect}) {
    const {loading, error, data} = useQuery(GET_PROJECTS);

    if (loading) return <p>Loading projects...</p>;
    if (error) return <p>Error loading projects</p>;

    return (
        <div>
            <h3>Projects</h3>
            <ul>
                {data.getProjects.map((project) => (
                    <li key={project.id}>
                        <button onClick={() => onSelect(project.rawId)}>
                            {project.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}


function TasksList({projectId}) {
    const {loading, error, data} = useQuery(GET_TASKS, {
        variables: {projectId},
    });

    if (loading) return <p>Loading tasks...</p>;
    if (error) return <p>Error loading tasks</p>;

    return (
        <div>
            <h3>Tasks for Project {projectId}</h3>
            <ul>
                {data.getTasks.map((task) => (
                    <li key={task.id}>{task.name}</li>
                ))}
            </ul>
        </div>
    );
}

function App() {
    // Separate useState hooks for client and selectedProjectId
    const [client, setClient] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    // Initialize Apollo Client after config is loaded
    useEffect(() => {
        const initApolloClient = async () => {
            const apolloClient = await getApolloClient();
            setClient(apolloClient);
        };
        initApolloClient();
    }, [setClient]);

    if (!client) {
        return <p>Loading...</p>; // Or a loading spinner
    }

    return (
        <ApolloProvider client={client}>
            <Router>
                <div className="App">
                    {/* Pass setSelectedProjectId as onSelect */}
                    <ProjectsList onSelect={setSelectedProjectId}/>
                    {selectedProjectId && <TasksList projectId={selectedProjectId}/>}
                </div>
            </Router>
        </ApolloProvider>
    );
}


export default App;
