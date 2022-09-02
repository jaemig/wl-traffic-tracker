import { createContext, useContext } from "react";
import { Languages } from "./types";

type LanguageData = {
    header: {
        update: string
    },
    timerange: {
        day: string,
        week: string,
        month: string,
        year: string
    },
    stats: {
        delays: string,
        disturbances: string,
        elevators: string,
        reports: string
    },
    graphs: {
        report_history: {
            title: string,
            disturbances: string,
            delays: string
        },
        report_ranking: {
            title: string
        },
        report_causes: {
            title: string,
            defective_unit: string,
            deployments: string,
            misc: string,
            track_works: string,
            traffic_obstruction: string
        },
        report_line_types: {
            title: string,
            tram: string,
            subway: string,
            bus: string,
        },
        disturbance_lengths: {
            title: string,
            subway: string,
            bus: string,
            tram: string
        },
        reports_month: {
            title: string,
            disturbances: string,
            delays: string
        }
    },
    footer: {
        data_reference: string,
        reference: string,
    },
    toasts: {
        manual_update: string,
        update_failed: string,
        lang_change: string,
        lang_change_complete: string
    }
}

export type LanguageContextType = {
    langData: LanguageData | null,
    setLangData?: (value: LanguageData) => void;
}

export const LanguageContext = createContext<LanguageContextType>({langData: null, setLangData: () => {} });
export const getLanguageContext = () => useContext(LanguageContext);
export { LanguageData };
// export { LanguageContext, LanguageContextType };
