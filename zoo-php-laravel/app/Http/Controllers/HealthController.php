<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Symfony\Component\HttpFoundation\Response;

class HealthController extends Controller
{
    const SERVICE_MYSQL = 'MySQL';
    const SERVICE_REDIS = 'Redis';
    const STATUS_OK = 'OK';
    const STATUS_ERROR = 'ERROR';

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
            self::SERVICE_MYSQL => self::STATUS_OK,
            self::SERVICE_REDIS => self::STATUS_OK
        ];

        try {
            // Attempt to connect to the database
            DB::connection()->getPdo();
        } catch (Exception $e) {
            // If connection fails, set MySQL status to ERROR and keep testing
            Log::error("Readiness check failed. Mysql: " . $e->getCode() . ":" . $e->getMessage());
            $readiness_status[self::SERVICE_MYSQL] = self::STATUS_ERROR;
        }

        // Check Redis connection
        try {
            $redis = Redis::connection();
            $redis->setex('write_check', 5, '1');  // Test write operation
            if ("PONG" != $redis->ping()) {
                throw new \Exception('no pong');
            }
        } catch (Exception $e) {
            Log::error("Readiness check failed. Redis: " . $e->getCode() . ":" . $e->getMessage());
            $readiness_status[self::SERVICE_REDIS] = self::STATUS_ERROR;
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
