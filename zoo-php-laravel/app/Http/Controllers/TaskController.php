<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TaskController extends Controller
{
    /**
     * Return all tasks in project by project_id
     * @param Project $project
     * @return JsonResponse
     */
    public function index(Project $project): JsonResponse
    {
        $tasks = Task::where('project_id', $project->id)->orderBy('priority', 'asc')->get();
        return response()->json([
            'status' => 'OK',
            'result' => $tasks
        ], Response::HTTP_OK);

    }

    /**
     * Created new task and return it
     * @param Project $project
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Project $project, Request $request): JsonResponse
    {
        // Validate request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Create a new task
        $task = new Task($validatedData);

        // Assign the passed in project
        $task->project_id = $project->id;

        // get last priority from that project
        $priority = Task::where('project_id', $project->id)->max('priority');
        // advance priority by 1, on set to 1 if no tasks in that project
        $priority = $priority
            ? $priority + 1
            : 1;
        // Assign the calculated priority
        $task->priority = $priority;


        // actually store in db
        $task->save();

        return response()->json([
            'status' => 'OK',
            'result' => $task
        ], Response::HTTP_CREATED);
    }

    /**
     * Update the name of task by ID
     * @param Project $project
     * @param Task $task
     * @param Request $request
     * @return JsonResponse
     */
    public function update(Project $project, Task $task, Request $request): JsonResponse
    {
        // Validate request data
        $validatedData = $request->validate([
            'name'       => 'required|string|max:255',
            'project_id' => 'required|exists:projects,id',
        ]);

        $task->name = $validatedData["name"];               // Update the task name
        $task->project_id = $validatedData["project_id"];   // Update the project id
        $task->save();

        return response()->json([
            'status' => 'OK',
            'result' => $task
        ], Response::HTTP_OK);
    }

    /**
     * Return the specified task by ID.
     * @param Project $project
     * @param Task $task
     * @return JsonResponse
     */
    public function show(Project $project, Task $task): JsonResponse
    {
        return response()->json([
            'status' => 'OK',
            'result' => $task
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified task
     * @param Project $project
     * @param Task $task
     * @return JsonResponse
     */
    public function destroy(Project $project, Task $task): JsonResponse
    {
        // Delete the task
        $task->delete();

        return response()->json([
            'status' => 'OK',
            'result' => 'Task deleted successfully'
        ], Response::HTTP_OK);
    }

    /**
     * Reorder the tasks in project
     * @param Request $request
     * @return JsonResponse
     */
    public function reorder(Request $request): JsonResponse
    {
        foreach ($request->tasks as $index => $taskId) {
            $task = Task::find($taskId);
            $task->priority = $index + 1;
            $task->save();
        }

        return response()->json([
            'status' => 'success'
        ], Response::HTTP_OK);
    }
}
