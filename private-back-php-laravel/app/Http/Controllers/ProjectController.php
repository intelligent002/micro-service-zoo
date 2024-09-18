<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $projects = Project::all();
        return response()->json([
            'status'   => 'OK',
            'projects' => $projects
        ], Response::HTTP_OK);
    }

    /**
     * Created resource in storage and return it
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        // Validate request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Create a new project
        $project = Project::create($validatedData);

        return response()->json([
            'status'  => 'OK',
            'project' => $project
        ], Response::HTTP_CREATED);
    }

    /**
     * Return the specified resource by ID.
     * @param Project $project
     * @return JsonResponse
     */
    public function show(Project $project): JsonResponse
    {
        return response()->json([
            'status'  => 'OK',
            'project' => $project
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param Project $project
     * @return JsonResponse
     */
    public function update(Request $request, Project $project): JsonResponse
    {
        // Validate request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Update the project with validated data
        $project->update($validatedData);

        return response()->json([
            'status'  => 'OK',
            'project' => $project
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     * @param Project $project
     * @return JsonResponse
     */
    public function destroy(Project $project): JsonResponse
    {
        // Delete the project
        $project->delete();

        return response()->json([
            'status'  => 'OK',
            'message' => 'Task deleted successfully'
        ]);
    }
}
