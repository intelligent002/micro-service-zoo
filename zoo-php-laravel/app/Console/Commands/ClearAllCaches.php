<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ClearAllCaches extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:clear-all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear and rebuild all caches (routes, config, views, etc.)';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Clearing application cache...');
        $this->call('cache:clear');

        $this->info('Clearing route cache...');
        $this->call('route:clear');

        $this->info('Clearing config cache...');
        $this->call('config:clear');

        $this->info('Clearing compiled views...');
        $this->call('view:clear');

        $this->info('Clearing compiled classes...');
        $this->call('clear-compiled');

        // Optionally re-cache routes and config for production
        $this->info('Rebuilding config cache...');
        $this->call('config:cache');

        $this->info('Rebuilding route cache...');
        $this->call('route:cache');

        // Optionally optimize the autoloader
        $this->info('Optimizing application...');
        $this->call('optimize');

        $this->info('All caches cleared and rebuilt successfully.');

        return 0;
    }
}
