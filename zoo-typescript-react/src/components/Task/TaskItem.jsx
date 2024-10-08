import React from 'react';
import {format} from "date-fns";

function TaskItem({task}) {
    return (
        <li>{format(new Date(task.createdAt), 'yyyy-MM-dd HH:mm:ss')}: {task.name}</li>
    );
}

export default TaskItem;
