import React from 'react';

function TaskItem({task}) {
    return (
        <ul>
            <li key={task.id}>{task.created_at}: {task.name}</li>
        </ul>
    );
}

export default TaskItem;
