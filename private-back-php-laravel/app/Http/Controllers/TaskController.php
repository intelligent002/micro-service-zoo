<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        // Check if project_id exists, if not, use default project
        $selectedProjectId = $request->project
            ? (int)$request->project
            : Project::where('name', 'Default Project')->first()->id;

        // Get all projects for the dropdown
        $projects = Project::all();

        $tasks = Task::where('project_id', $selectedProjectId)->orderBy('priority', 'asc')->get();

        return view('tasks.index', compact('tasks', 'projects', 'selectedProjectId'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'project_id' => 'required|integer|exists:projects,id'
        ]);

        // Check if project_id exists, if not, use default project
        $project = $request->project_id
            ? Project::find($request->project_id)
            : Project::where('name', 'Default Project')->first();

        $task = new Task($request->all());
        $task->priority = Task::where('project_id', $request->project_id)->count() + 1;
        $task->project_id = $project->id; // Assign the default or selected project
        $task->save();
        return redirect()->route('tasks.index', ['project' => $project->id]);
    }

    public function edit($id)
    {
        $task = Task::findOrFail($id);
        $projects = Project::all();
        return view('tasks.edit', compact('task', 'projects'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'project_id' => 'required|exists:projects,id',  // Ensure project_id is valid
        ]);

        $task = Task::findOrFail($id);
        $task->name = $request->name;  // Update the task name
        $task->project_id = $request->project_id;  // Update the project if necessary
        $task->save();

        return redirect()->route('tasks.index', ['project' => $task->project_id])->with('success', 'Task renamed successfully.');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->route('tasks.index', ['project' => $task->project_id]);
    }

    public function reorder(Request $request)
    {
        foreach ($request->tasks as $index => $taskId) {
            $task = Task::find($taskId);
            $task->priority = $index + 1;
            $task->save();
        }

        return response()->json(['status' => 'success']);
    }
}
