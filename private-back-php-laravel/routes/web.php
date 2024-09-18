<?php

use App\Http\Controllers\IndexController;
use Illuminate\Support\Facades\Route;

// Route for index
Route::get('/', [
    IndexController::class,
    'index'
])->name('index');
