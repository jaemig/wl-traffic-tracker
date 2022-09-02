<?php

namespace App\Http\Controllers;

use App\Services\LanguageService;
use Illuminate\Http\Request;

class LanguageController extends Controller
{

    public function __construct(LanguageService $language_service)
    {
        $this->language_service = $language_service;
    }

    /**
     * Returns the data for the requested language
     * @param Illuminate\Http\Request $request
     * @param string $language
     */
    public function getLanguageData(Request $request, $lang) {
        $answ = $this->language_service->getLanguage($lang);
        return $answ;
    }
}
