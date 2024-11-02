<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Prometheus\CollectorRegistry;
use Prometheus\Exception\MetricsRegistrationException;
use Prometheus\RenderTextFormat;
use Prometheus\Storage\Redis;
use Throwable;

class PrometheusMetricsMiddleware
{
    protected ?CollectorRegistry $registry = null; // Make registry nullable

    public function __construct()
    {
        try {
            // Set Redis connection options for Prometheus client
            $redisStorage = new Redis([
                'host' => config('database.redis.default.host'),
                'port' => config('database.redis.default.port'),
                'username' => config('database.redis.default.username'),
                'password' => config('database.redis.default.password'),
                'timeout' => 0.5, // Adjust timeout as needed
            ]);
            $this->registry = new CollectorRegistry($redisStorage);
        } catch (\Exception $e) {
            Log::error("Failed to initialize metrics registry: " . $e->getCode() . ":" . $e->getMessage());
        }
    }

    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     * @throws MetricsRegistrationException
     */
    public function handle(Request $request, Closure $next): mixed
    {
        // We only want to observe specific routes, e.g., /api/data
        if ($this->registry && $request->is('api/*')) {
            // Record the start time for request duration tracking
            $startTime = microtime(true);

            // Handle the request
            $response = $next($request);

            // Calculate request duration in seconds
            $duration = microtime(true) - $startTime;

            // Register and observe a histogram for request duration
            $histogram = $this->registry->getOrRegisterHistogram(
                'api',
                'rest_request_duration_seconds',
                'Histogram of API Request durations in seconds for /api/*',
                ['method', 'endpoint', 'pod'],
                [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 15, 20, 30]
            );

            // Observe the duration for the request, including labels
            $hostname = gethostname(); // Unique pod identifier
            $histogram->observe($duration, [$request->method(), $request->path(), $hostname]);

            return $response;
        }


        // For all other requests, proceed without tracking
        return $next($request);
    }

    /**
     * @throws Throwable
     */
    public function metrics(): Application|Response|ResponseFactory
    {
        if ($this->registry) {
            $renderer = new RenderTextFormat();

            $result = $renderer->render($this->registry->getMetricFamilySamples());
            return response($result, 200)
                ->header('Content-Type', RenderTextFormat::MIME_TYPE);
        }

        return response("Metrics registry is not initialized.", 500);
    }
}
