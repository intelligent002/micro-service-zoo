<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function health()
    {
        try {
            // Attempt to connect to the database
            //DB::connection()->getPdo();

            // If successful, return "status: ok"
            return response()->json(['status' => 'OK']); // 200 is the default status
        } catch (Exception $e) {
            // If connection fails, return "status: error" and the exception message
            return response()->json([
                'status' => 'error',
                'message' => 'Could not connect to the database. Please check your configuration.'
            ], 500);
        }
    }
}
