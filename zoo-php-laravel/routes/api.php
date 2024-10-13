<?php

use App\Http\Controllers\HealthController;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;


// Route for index
Route::get('/', [
    IndexController::class, 'index'
])->name('index');

// Routes for Health
Route::controller(HealthController::class)->group(function () {
    // only app
    Route::get('liveness', 'liveness');
    // with subsidiaries
    Route::get('readiness', 'readiness');
});

// Routes for Projects
Route::apiResources([
    'projects' => ProjectController::class
]);

// Routes for Tasks
Route::controller(TaskController::class)->group(function () {
    // tasks reorder
    Route::post('projects/{project}/tasks/prioritize', 'prioritize')->name("tasks.prioritize");
    // tasks create
    Route::post('projects/{project}/tasks', 'store')->name("tasks.create");
    // tasks get all
    Route::get('projects/{project}/tasks', 'index')->name("tasks.index");
    // tasks get specific
    Route::get('projects/{project}/tasks/{task}', 'show')->name("tasks.show");
    // tasks update
    Route::post('projects/{project}/tasks/{task}', 'update')->name("tasks.update");
    // tasks delete
    Route::delete('projects/{project}/tasks/{task}', 'destroy')->name("tasks.destroy");
});


