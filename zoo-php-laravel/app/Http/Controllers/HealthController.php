<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class HealthController extends Controller
{
    const string SERVICE_MYSQL = 'MySQL';
    const string STATUS_OK = 'OK';
    const string STATUS_ERROR = 'ERROR';

    /**
     * Health check liveness - app local scope only
     * @return JsonResponse
     */
    public function liveness(): JsonResponse
    {
        Log::info("Liveness check passed.");
        return response()->json([
            'status' => self::STATUS_OK
        ], Response::HTTP_OK);
    }

    /**
     * Health check readiness - app subsidiary services too
     * @return JsonResponse
     */
    public function readiness(): JsonResponse
    {
        // we're an optimists
        $readiness_status = [
            self::SERVICE_MYSQL => self::STATUS_OK
        ];

        try {
            // Attempt to connect to the database
            DB::connection()->getPdo();
        } catch (Exception $e) {
            // If connection fails, set MySQL status to ERROR and keep testing
            Log::error("Readiness check failed. Mysql: " . $e->getCode() . ":" . $e->getMessage());
            $readiness_status[self::SERVICE_MYSQL] = self::STATUS_ERROR;
        }

        if (in_array(self::STATUS_ERROR, $readiness_status)) {
            // found errors - return "status: ERROR"
            return response()->json([
                'status' => self::STATUS_ERROR,
                'result' => $readiness_status
            ], Response::HTTP_SERVICE_UNAVAILABLE); // 503
        }

        // not found - return "status: OK"
        Log::info("Readiness check passed.");
        return response()->json([
            'status' => self::STATUS_OK,
            'result' => $readiness_status
        ], Response::HTTP_OK); // 200 is the default status
    }
}
