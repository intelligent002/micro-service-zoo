<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;

// Route for list of a tasks
Route::controller(TaskController::class)->group(function () {
    Route::get('/', 'index')->name('tasks.index');
    Route::get('/tasks/{project}', 'index')->name('tasks.index');
});

// Route for reorder a task by drag`n`drop
Route::post('tasks/reorder', [TaskController::class, 'reorder'])->name('tasks.reorder');

// Route for editing a task
Route::get('tasks/{task}/edit', [TaskController::class, 'edit'])->name('tasks.edit');

// Route for updating a task
Route::put('tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');

// Route for store a task
Route::post('tasks', [TaskController::class, 'store'])->name('tasks.store');

// Route for destroying a task
Route::delete('tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
