<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @OA\Schema(
 *     @OA\Xml(name="Project")
 * )
 */
class Project extends Model
{
    use HasFactory;

    /**
     * @var int $id
     */
    public int $id;
    /**
     * @var string $name
     */
    public string $name;

    protected $fillable = ['name'];

    /**
     * @return HasMany
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
