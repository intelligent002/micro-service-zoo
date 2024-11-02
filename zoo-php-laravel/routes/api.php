<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use L5Swagger\Http\Controllers\SwaggerController;

// Routes for /api/
Route::prefix('api')->group(function () {
    // Routes for Projects
    Route::apiResource('projects', ProjectController::class);

    // Routes for Tasks
    Route::post('projects/{project}/tasks', [TaskController::class, 'store'])->name('tasks.create');
    Route::get('projects/{project}/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::get('projects/{project}/tasks/{task}', [TaskController::class, 'show'])->name('tasks.show');
    Route::post('projects/{project}/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('projects/{project}/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
    Route::patch('projects/{project}/tasks/{task}/migrate', [TaskController::class, 'migrate'])->name('tasks.migrate');
    Route::post('projects/{project}/tasks/prioritize', [TaskController::class, 'prioritize'])->name('tasks.prioritize');

});

// OAuth callback route for Swagger
Route::get('api/oauth2-callback', [
    SwaggerController::class, 'oauth2Callback'
])->name('l5-swagger.default.oauth2_callback');
