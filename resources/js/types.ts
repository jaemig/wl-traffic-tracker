type TabValues = 'd' | 'w' | 'm' | 'y'

type ReportHistoryData = { name: number, disturbances: number, delays: number}

type ReportRankingData = { name: string, reports: number }

type ReportLineTypesData = { name: string, reports: number }

type ReportTypesData = { name: string, reports: number }

type DisruptionLengthData = { name: string, x: number, y: number }

type DisturbancesMonthData = { name: number, disturbances: number, delays: number }

export { TabValues, ReportHistoryData, ReportRankingData, ReportLineTypesData, ReportTypesData, DisruptionLengthData, DisturbancesMonthData}
