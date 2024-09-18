<?php

use App\Http\Controllers\HealthController;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

// Route for index
Route::get('/', [
    IndexController::class,
    'index'
])->name('index');

// Routes for Health
Route::controller(HealthController::class)->group(function () {
    // Route for HealthCheck
    Route::get('liveness', 'liveness')->name('health.liveness');
    Route::get('readiness', 'readiness')->name('health.readiness');
});

Route::apiResources([
    'projects' => ProjectController::class
]);

Route::apiResource('tasks', TaskController::class)->except([
    'index',
    'store',
    'reorder',
]);

// custom route for listing of project related tasks
Route::get('projects/{project}/tasks', [
    TaskController::class,
    'index'
])->name('tasks.index');

// custom route for storing a task in a project
Route::post('projects/{project}/tasks', [TaskController::class, 'store'])->name('tasks.store');

// custom route for tasks reordering
Route::post('tasks/reorder', [
    TaskController::class,
    'reorder'
])->name('tasks.reorder');


