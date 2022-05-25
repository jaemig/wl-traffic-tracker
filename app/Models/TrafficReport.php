<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrafficReport extends Model
{
    use HasFactory;

    protected $table = 'traffic_reports';
    public $timestamps = false;
}
