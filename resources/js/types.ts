type TabValues = 'd' | 'w' | 'm' | 'y'

type GraphTabIds = 1 | 2 | 3 | 4

type ReportHistoryData = { name: number, disturbances: number, delays: number}

type ReportRankingData = { name: string, reports: number }

type ReportLineTypesData = { name: string, reports: number }

type ReportTypesData = { name: string, reports: number }

type DisruptionLengthData = { name: string, x: number, y: number }

type DisturbancesMonthData = { name: number, disturbances: number, delays: number }

enum Languages {
    DE = 'DE',
    EN = 'EN'
}

export { TabValues, GraphTabIds, ReportHistoryData, ReportRankingData, ReportLineTypesData, ReportTypesData, DisruptionLengthData, DisturbancesMonthData, Languages }
