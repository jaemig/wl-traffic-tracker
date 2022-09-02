<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class LanguageService {

    /**
     * Gets the data for the specified language.
     * Returns an empty string if the process fails.
     * @param string $language
     * @return string
     */
    public function getLanguage($lang)
    {
        try
        {
            if (strtolower($lang) === 'de')
            {
                return Storage::get('lang/de.json');
            }
            else
            {
                return Storage::get('lang/en.json');
            }
        }
        catch (\Exception $e) { return ""; }

    }

}

?>
