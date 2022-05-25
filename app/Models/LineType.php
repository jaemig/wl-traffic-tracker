<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LineType extends Model
{
    use HasFactory;

    protected $table = 'line_types';
    public $timestamps = false;
}
