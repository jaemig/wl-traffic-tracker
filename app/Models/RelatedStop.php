<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelatedStop extends Model
{
    use HasFactory;

    protected $table = 'related_stops';
    public $timestamps = false;
}
