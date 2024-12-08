<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Prometheus\CollectorRegistry;
use Prometheus\Exception\MetricsRegistrationException;
use Prometheus\RenderTextFormat;
use Throwable;

class PrometheusMetricsMiddleware
{
    protected ?CollectorRegistry $registry = null; // Make registry nullable

    public function __construct(CollectorRegistry $registry)
    {
        $this->registry = $registry;
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
            try {

                // Record the start time for request duration tracking
                $startTime = microtime(true);

                // Handle the request
                $response = $next($request);

            } finally {

                // Calculate request duration in seconds
                $duration = microtime(true) - $startTime;

                // Register and observe a histogram for request duration
                $histogram = $this->registry->getOrRegisterHistogram(
                    'api',
                    'rest_request_duration_seconds',
                    'Histogram of API Request durations in seconds for /api/*',
                    ['method', 'endpoint', 'pod', 'environment'],
                    [0.001, 0.005, 0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, 15, 20, 30]
                );

                // Observe the duration for the request, including labels
                $environment = config('app.env', 'production');
                $hostname = gethostname(); // Unique pod identifier
                $endpoint = $request->route()
                    ? $request->route()->getName()
                    : 'unknown';
                $histogram->observe($duration, [$request->method(), $endpoint, $hostname, $environment]);
            }
            return $response;
        }

        // For all other requests, proceed without tracking
        return $next($request);
    }

    /**
     * @throws Throwable
     */
    public function metrics(): Response|ResponseFactory
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
