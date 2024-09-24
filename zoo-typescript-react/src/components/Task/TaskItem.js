import React from 'react';

function TaskItem({task}) {
    return (
        <ul>
            <li key={task.id}>{task.name}</li>
        </ul>
    );
}

export default TaskItem;
