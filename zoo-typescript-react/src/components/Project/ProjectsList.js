import React from 'react';
import ProjectItem from './ProjectItem';
import {useQuery} from "@apollo/client";
import {GET_PROJECTS} from "../../graphql/queries/projectQueries";

function ProjectsList({onSelect}) {
    const {loading, error, data} = useQuery(GET_PROJECTS);

    // Display a loading message while the query is in progress
    if (loading) {
        return <p>Loading projects...</p>;
    }

    // If there's an error, display the error message
    if (error) {
        return <p>Error loading projects: {error.message}</p>;
    }

    // Check if data is available and contains projects
    if (!data || !data.getProjects || data.getProjects.length === 0) {
        return <p>No projects available.</p>;
    }

    return (
        <div className="app-container">
            <h3>Projects</h3>
            <ul className="project-list">
                {data.getProjects.map(project => (
                    <ProjectItem key={project.id} project={project} onSelect={onSelect}/>
                ))}
            </ul>
        </div>
    );
}

export default ProjectsList;
