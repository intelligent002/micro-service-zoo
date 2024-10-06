<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @method static where(string $string, mixed $id)
 * @method static find(mixed $taskId)
 */
class Task extends Model
{
    use HasFactory;

    /**
     * @var mixed $project_id
     */
    public int $project_id;
    /**
     * @var int $priority
     */
    public int $priority;
    /**
     * @var string $name
     */
    public string $name;

    protected $fillable = ['name', 'priority', 'project_id'];

    /**
     * @return BelongsTo
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
