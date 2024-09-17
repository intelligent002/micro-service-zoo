<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use PharIo\Version\Exception;
use Symfony\Component\HttpFoundation\Response;

class ProjectController extends Controller
{
    /**
     * Return welcome message
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(['message' => 'Welcome to REST API for Projects and Tasks']);
    }

    /**
     * Return all projects
     * @return JsonResponse
     */
    public function read_all(): JsonResponse
    {
        try {
            $projects = Project::all();
            return response()->json([
                'status'   => 'OK',
                'projects' => $projects
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error("Failed to execute " . __FUNCTION__ . " - " . $e->getCode() . ":" . $e->getMessage());
            return response()->json([
                'status'  => 'ERROR',
                'message' => 'Request Failed, investigate the logs for additional details'
            ], Response::HTTP_SERVICE_UNAVAILABLE);
        }
    }

    /**
     * Return a single project by ID
     * @param Request $request
     * @return JsonResponse
     */
    public function read_by_id(Request $request): JsonResponse
    {
        try {
            // filter out all but required input fields
            $input = request()->only(["project"]);

            $validator = Validator::make($input, [
                'project' => [
                    'required|integer'
                ]
            ]);

            if ($validator->fails()) {
                // bad request received
                $message = "Bad request received, project field is missing or non integer value";
                Log::warning($message);
                return response()->json([
                    'status'  => 'error',
                    'message' => $message
                ], Response::HTTP_NOT_FOUND);
            }

            // Find the project by ID
            $project = Project::find($input["project"]);

            // Check if the project exists
            if (!$project) {
                $message = "Project ID [" . $input["project"] . "] not found.";
                Log::debug($message);
                return response()->json([
                    'status'  => 'error',
                    'message' => $message
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'status'  => 'OK',
                'project' => $project
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error("Failed to execute " . __FUNCTION__ . " - " . $e->getCode() . ":" . $e->getMessage());
            return response()->json([
                'status'  => 'ERROR',
                'message' => 'Request Failed, investigate the logs for additional details'
            ], Response::HTTP_SERVICE_UNAVAILABLE);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function update(Request $request): JsonResponse
    {
        try {
            $project = Project::create($request->all());
            return response()->json([
                'status'  => 'OK',
                'project' => $project
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error("Failed to execute " . __FUNCTION__ . " - " . $e->getCode() . ":" . $e->getMessage());
            return response()->json([
                'status'  => 'ERROR',
                'message' => 'Request Failed, investigate the logs for additional details'
            ], Response::HTTP_SERVICE_UNAVAILABLE);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        try {
            $project = Project::create($request->all());
            return response()->json([
                'status'  => 'OK',
                'project' => $project
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error("Failed to execute " . __FUNCTION__ . " - " . $e->getCode() . ":" . $e->getMessage());
            return response()->json([
                'status'  => 'ERROR',
                'message' => 'Request Failed, investigate the logs for additional details'
            ], Response::HTTP_SERVICE_UNAVAILABLE);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function delete(Request $request): JsonResponse
    {
        try {
            $project = Project::create($request->all());
            return response()->json([
                'status'  => 'OK',
                'project' => $project
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error("Failed to execute " . __FUNCTION__ . " - " . $e->getCode() . ":" . $e->getMessage());
            return response()->json([
                'status'  => 'ERROR',
                'message' => 'Request Failed, investigate the logs for additional details'
            ], Response::HTTP_SERVICE_UNAVAILABLE);
        }
    }
}
