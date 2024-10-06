import React from 'react';
import TaskItem from './TaskItem';
import {useQuery} from "@apollo/client";
import {GET_TASKS} from "../../graphql/queries/taskQueries";

function TasksList({project}) {
    const {loading, error, data} = useQuery(GET_TASKS, {
        variables: {projectId: project.id},
        skip: !project.id, // Skip the query if projectId is not provided
    });

    if (loading) return <p>Loading tasks...</p>;
    if (error) return <p>Error loading tasks</p>;

    return (
        <div>
            <h3>Tasks for {project.name}</h3>
            <ul>
                {data.getTasks.map((task) => (
                    <TaskItem key={task.id} task={task}/>
                ))}
            </ul>
        </div>
    );
}

export default TasksList;
