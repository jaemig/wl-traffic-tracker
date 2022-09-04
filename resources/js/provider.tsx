import { ChakraProvider } from "@chakra-ui/react";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import React, { createContext, FC, useEffect, useState } from "react"
import ReactDOM from "react-dom";
import App from "./app";
import { LanguageContext, LanguageData } from "./context";
import { Languages } from "./types";

const Provider: FC = () => {

    const [hasLangLoaded, setHasLangLoaded] = useState(false);
    const [lang, setLang] = useState<Languages>(Languages.EN);
    const [langData, setLangData] = useState<LanguageData | null>(null);

    useEffect(() => {
        let cookie_lang: keyof typeof Languages = Cookies.get('lang') as 'DE' | 'EN';
        if (!cookie_lang) {
            Cookies.set('lang', Languages.EN.toString());
            cookie_lang = Languages.EN;
        }
        setLang(Languages[cookie_lang]);
        getLanguage(cookie_lang ?? 'en');
    }, [])


    const getLanguage = (cust_lang: string = lang) => {
        axios.get('/lang/' + cust_lang.toString())
        .then((res: AxiosResponse) => {
            if (res.status === 200)
            {
                setHasLangLoaded(true);
                setLangData(res.data);
            }
        })
        .catch()
    }

    const setLanguage = (): Languages => {
        const new_lang = lang === Languages.DE ? Languages.EN : Languages.DE;
        getLanguage(new_lang);
        setLang(new_lang);
        Cookies.set('lang', new_lang.toString());
        return new_lang;
    }

    // const LanguageContext = createContext('de');

    const render = () => (
        <LanguageContext.Provider value={{langData: langData, setLangData: setLangData }}>
            <ChakraProvider>
                {
                    hasLangLoaded &&
                        <App lang={lang} setLang={setLanguage} />
                }
            </ChakraProvider>
        </LanguageContext.Provider>
    )


    return render();
}

ReactDOM.render(
    <Provider />,
    document.getElementById('root')
)
