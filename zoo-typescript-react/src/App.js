// src/App.js
import React, { useState } from 'react';
import { ApolloProvider, useQuery } from '@apollo/client';
import client from './apollo-client';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { gql } from '@apollo/client';

// GraphQL Queries
const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
    }
  }
`;

const GET_TASKS = gql`
  query GetTasks($projectId: ID!) {
    tasks(projectId: $projectId) {
      id
      name
      project_id
    }
  }
`;

function ProjectsList({ onSelect }) {
  const { loading, error, data } = useQuery(GET_PROJECTS);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error loading projects</p>;

  return (
      <div>
        <h3>Projects</h3>
        <ul>
          {data.projects.map((project) => (
              <li key={project.id}>
                <button onClick={() => onSelect(project.id)}>{project.name}</button>
              </li>
          ))}
        </ul>
      </div>
  );
}

function TasksList({ projectId }) {
  const { loading, error, data } = useQuery(GET_TASKS, {
    variables: { projectId },
  });

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error loading tasks</p>;

  return (
      <div>
        <h3>Tasks for Project {projectId}</h3>
        <ul>
          {data.tasks.map((task) => (
              <li key={task.id}>{task.name}</li>
          ))}
        </ul>
      </div>
  );
}

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  return (
      <ApolloProvider client={client}>
        <Router>
          <div className="App">
            <ProjectsList onSelect={setSelectedProjectId} />
            {selectedProjectId && <TasksList projectId={selectedProjectId} />}
          </div>
        </Router>
      </ApolloProvider>
  );
}

export default App;
