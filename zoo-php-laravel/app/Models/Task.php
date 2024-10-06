<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @method static where(string $string, mixed $id)
 * @method static find(mixed $taskId)
 * @property mixed $name
 * @property mixed $project_id
 * @property int $priority
 */
class Task extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'priority', 'project_id'];

    /**
     * @return BelongsTo
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
