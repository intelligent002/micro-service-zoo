import React from 'react';

function ProjectItem({ project, onSelect }) {
    return (
        <li>
            <button onClick={() => onSelect(project.id)}>{project.name}</button>
        </li>
    );
}

export default ProjectItem;
