import React from 'react';
import {format} from "date-fns";

function TaskItem({task}) {
    return (
        <ul>
            <li key={task.id}>{format(new Date(task.createdAt), 'MMMM do, yyyy, h:mm a')}: {task.name}</li>
        </ul>
    );
}

export default TaskItem;
