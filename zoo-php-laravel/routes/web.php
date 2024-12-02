<?php

use App\Http\Controllers\HealthController;
use App\Http\Controllers\IndexController;
use App\Http\Middleware\PrometheusMetricsMiddleware;
use Illuminate\Support\Facades\Route;
use L5Swagger\Http\Controllers\SwaggerAssetController;
use L5Swagger\Http\Controllers\SwaggerController;

// Route for index
Route::get('/', [IndexController::class, 'index'])->name('index');

// Swagger documentation routes
//Route::prefix('docs')->group(function () {
//    Route::get('/', [
//        SwaggerController::class, 'api'
//    ])->name('l5-swagger.default.api');
//    Route::get('/asset/{asset}', [
//        SwaggerAssetController::class, 'index'
//    ])->name('l5-swagger.default.asset');
//    Route::get('/{jsonFile?}', [
//        SwaggerController::class, 'docs'
//    ])->name('l5-swagger.default.docs');
//});

// Route for metrics
Route::get('/metrics', [PrometheusMetricsMiddleware::class, 'metrics'])->name('metrics');

// Routes for Health (under /health)
Route::prefix('health')->group(function () {
    Route::get('liveness', [HealthController::class, 'liveness'])->name('health.liveness');
    Route::get('readiness', [HealthController::class, 'readiness'])->name('health.readiness');
});
