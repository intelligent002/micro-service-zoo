<?php

namespace App\Http\Controllers;

use Exception;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HealthController extends Controller
{
    /**
     * Health check liveness - app local scope only
     * @return JsonResponse
     */
    public function liveness(): JsonResponse
    {
        Log::info("Liveness check passed.");
        return response()->json(['status' => 'OK'], Response::HTTP_OK);
    }

    /**
     * Health check readiness - app subsidiary services too
     * @return JsonResponse
     */
    public function readiness(): JsonResponse
    {
        // we're an optimists
        $readiness_status = [
            "MySQL" => "OK"
        ];

        try {
            // Attempt to connect to the database
            DB::connection()->getPdo();
        } catch (Exception $e) {
            // If connection fails, set MySQL status to ERROR and keep testing
            Log::error("Readiness check failed. Mysql: " . $e->getCode() . ":" . $e->getMessage());
            $readiness_status["MySQL"] = "ERROR";
        }

        if (!in_array("ERROR", $readiness_status)) {
            // not found - return "status: OK"
            Log::info("Readiness check passed.");
            return response()->json([
                'status'   => 'OK',
                'services' => $readiness_status
            ], Response::HTTP_OK); // 200 is the default status
        } else {
            // found - return "status: ERROR"
            return response()->json([
                'status'   => 'ERROR',
                'services' => $readiness_status
            ], Response::HTTP_SERVICE_UNAVAILABLE); // 503
        }
    }
}
