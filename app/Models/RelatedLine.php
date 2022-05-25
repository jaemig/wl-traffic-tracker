<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelatedLine extends Model
{
    use HasFactory;

    protected $table = 'related_lines';
    public $timestamps = false;
}
