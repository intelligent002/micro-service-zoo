<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {

        $exceptions->render(function (Exception $e, Request $request) {

            // Get route information
            $routeAction = $request->route()->getActionName(); // Get the controller and method
            $uri = $request->getRequestUri(); // Get the requested URI
            $method = $request->getMethod(); // Get the HTTP method (GET, POST, etc.)

            // Log the error with route and method information
            Log::error("Failed to execute {$routeAction} - {$method} {$uri} - " . $e->getCode());

            // Return json with custom error
            return response()->json([
                'status'  => 'ERROR',
                'message' => 'Request Failed, investigate the logs for additional details'
            ], Response::HTTP_OK);
        });

    })->create();
