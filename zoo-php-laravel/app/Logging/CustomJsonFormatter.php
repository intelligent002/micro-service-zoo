<?php
namespace App\Logging;

use Monolog\Formatter\JsonFormatter;
use Monolog\LogRecord;

class CustomJsonFormatter extends JsonFormatter
{
    public function format(LogRecord $record): string
    {
        $customRecord = [
            'timestamp'   => $record['datetime']->format('Y-m-d\TH:i:s\Z'), // ISO8601 format
            'level'       => $record['level_name'],
            'logger_name' => $record['channel'],
            'message'     => $record['message'],
            'host'        => env('HOSTNAME', ''),
            'environment' => env('APP_ENV', 'production'),
            'service_name'=> env('SERVICE_NAME', 'zoo-php-laravel'),
            'request_id'  => request()->header('X-Request-ID') ?? '',
            'trace_id'    => request()->header('X-Trace-ID') ?? '',
            'extra'       => array_merge($record['extra'], [
                'ip_address' => request()->ip(),
                'http_method' => request()->method(),
                'endpoint'    => request()->path(),
                'status_code' => http_response_code(),
                'response_time_ms' => microtime(true) - LARAVEL_START,
            ]),
        ];

        // Encode as JSON and return
        return json_encode($customRecord) . PHP_EOL;
    }
}
