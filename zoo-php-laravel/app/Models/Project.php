<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property mixed $id
 * @method static create(array $validatedData)
 * @OA\Schema(
 *     @OA\Xml(name="Project")
 * )
 */
class Project extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    /**
     * @return HasMany
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
