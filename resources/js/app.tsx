import { Box, Center, ChakraProvider, Heading, useColorModeValue, Text, Flex, Image, Link, Container, HStack, Checkbox, Skeleton, useColorMode, useToast } from '@chakra-ui/react';
import React, { createContext, Dispatch, FC, MouseEvent, SetStateAction, useContext, useEffect, useState } from 'react';
import TabItem from './comps/TabItem';
import { DisruptionLengthData, DisturbancesMonthData, Languages, ReportHistoryData, ReportLineTypesData, ReportRankingData, ReportTypesData, TabValues } from './types';
import StatItem from './comps/StatItem';
import axios, { AxiosResponse } from 'axios';
import { Area, AreaChart, Bar, CartesianGrid, Cell, ComposedChart, LabelList, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import CircleSwitchItem from './comps/CircleSwitchItem';
import GraphBox from './comps/GraphBox';
import Cookies from 'js-cookie';
import Header from './comps/header';

// FONTS
import "@fontsource/montserrat/variable.css";
import "@fontsource/inter/variable.css";

// ICONS

import AlertIcon from '../assets/alert_red.svg';
import WarnIcon from '../assets/alert_yellow.svg';
import ElevatorIcon from '../assets/elevator.png';
import EscalatorIcon from '../assets/escalator.png';
import ReportIcon from '../assets/report.png';
import Footer from './comps/footer';
import { LanguageContext } from './context';

let active_request = false;

interface AppProps {
    lang: Languages,
    setLang: () => void
}

const App: FC<AppProps> = ({ lang, setLang }) => {
    const { langData, setLangData } = useContext(LanguageContext);
    const [selectedTab, setSelectedTab] = useState<TabValues>('d');
    const [selectedGraphTab, setSelectedGraphTab] = useState<1 | 2 | 3>(1);
    const [statData, setStatData] = useState({disruptions: {val: 5, change: 23.36} , delays: {val: 8, change: 8.05}, elevators: {val: 6, change: 14.97 }, total: { val: 14, change: 11.25} })
    const [lastRequest, setLastRequest] = useState('-');
    const [reportHistoryData, setReportHistoryData] = useState<ReportHistoryData[]>([
        {
            name: 0,
            disturbances: 0,
            delays: 0
        },
        {
            name: 1,
            disturbances: 0,
            delays: 0
        },
        {
            name: 2,
            disturbances: 0,
            delays: 0
        },
        {
            name: 3,
            disturbances: 0,
            delays: 0
        },
        {
            name: 4,
            disturbances: 0,
            delays: 0
        },
        {
            name: 5,
            disturbances: 0,
            delays: 0
        },
        {
            name: 6,
            disturbances: 0,
            delays: 0
        },
        {
            name: 7,
            disturbances: 0,
            delays: 0
        },
        {
            name: 8,
            disturbances: 0,
            delays: 0
        },
        {
            name: 9,
            disturbances: 0,
            delays: 0
        },
        {
            name: 10,
            disturbances: 0,
            delays: 0
        },
        {
            name: 11,
            disturbances: 0,
            delays: 0
        },
        {
            name: 12,
            disturbances: 0,
            delays: 0
        },
        {
            name: 13,
            disturbances: 0,
            delays: 0
        },
        {
            name: 14,
            disturbances: 0,
            delays: 0
        },
        {
            name: 15,
            disturbances: 0,
            delays: 0
        },
        {
            name: 16,
            disturbances: 0,
            delays: 0
        },
        {
            name: 17,
            disturbances: 0,
            delays: 0
        },
        {
            name: 18,
            disturbances: 0,
            delays: 0
        },
        {
            name: 19,
            disturbances: 0,
            delays: 0
        },
        {
            name: 20,
            disturbances: 0,
            delays: 0
        },
        {
            name: 21,
            disturbances: 0,
            delays: 0
        },
        {
            name: 22,
            disturbances: 0,
            delays: 0
        },
        {
            name: 23,
            disturbances: 0,
            delays: 0
        },

    ]);
    const [reportRankingData, setReportRankingData] = useState<ReportRankingData[]>([
        {
            name: 'U1',
            reports: 0
        },
        {
            name: 'U2',
            reports: 0
        },
        {
            name: 'U3',
            reports: 0
        },
        {
            name: 'U4',
            reports: 0
        },
        {
            name: 'U5',
            reports: 0
        },
        {
            name: 'U6',
            reports: 0
        }
    ])
    const [reportLineTypesData, setReportLineTypesData] = useState<ReportLineTypesData[]>([
        {
            name: 'U-Bahn',
            reports: 34,
        },
        {
            name: 'Str.-Bahn',
            reports: 33,
        },
        {
            name: 'Bus',
            reports: 33,
        }
    ])
    const [reportTypesData, setReportTypesData] = useState<ReportTypesData[]>([
        {
            name: 'Einsätze',
            reports: 20
        },
        {
            name: 'Gleisarbeiten',
            reports: 20
        },
        {
            name: 'Schadhaftes Fahrzeug',
            reports: 20
        },
        {
            name: 'Verkehrsbehinderung',
            reports: 20
        },
        {
            name: 'Sonstiges',
            reports: 20
        }
    ])
    const [disruptionLengthData, setDisturbanceLengthData] = useState<DisruptionLengthData[]>([
        { name: 'U-Bahn', x: 100, y: 200 },
        { name: 'U-Bahn', x: 120, y: 100 },
        { name: 'Straßenbahn', x: 170, y: 300 },
        { name: 'Straßenbahn', x: 140, y: 250 },
        { name: 'Bus', x: 150, y: 400 },
        { name: 'Bus', x: 110, y: 180 },
    ])
    const [disturbanceMonthData, setDisturbanceMonthData] = useState<DisturbancesMonthData[]>([
        {
            name: 1,
            disturbances: 0,
            delays: 0
        },
        {
            name: 2,
            disturbances: 0,
            delays: 0
        },
        {
            name: 3,
            disturbances: 0,
            delays: 0
        },
        {
            name: 4,
            disturbances: 0,
            delays: 0
        },
        {
            name: 5,
            disturbances: 0,
            delays: 0
        },
        {
            name: 6,
            disturbances: 0,
            delays: 0
        },
        {
            name: 7,
            disturbances: 0,
            delays: 0
        },
        {
            name: 8,
            disturbances: 0,
            delays: 0
        },
        {
            name: 9,
            disturbances: 0,
            delays: 0
        },
        {
            name: 10,
            disturbances: 0,
            delays: 0
        },
        {
            name: 11,
            disturbances: 0,
            delays: 0
        },
        {
            name: 12,
            disturbances: 0,
            delays: 0
        }
    ])
    const [hasDataLoaded, setHasDataLoaded] = useState(false);
    const request_toast = useToast({
        position: 'bottom-right',
        title: langData?.toasts.update_failed,
        status: 'error',
        isClosable: true,
        duration: 3000,
    })
    const purple = useColorModeValue('#040244', '#040244');
    // const gentle_red = useColorModeValue('#EB4E87', '#EB4E87');
    const graph_blue = useColorModeValue('#00509D', '#5ea4e6');
    const line_type_ranking_colors = [graph_blue, '#EA0054', '#FD760A'];
    const borderColor = useColorModeValue('gray.200', '#4B6992');
    const disruption_length_colors = {'U-Bahn': '#EB4E87', 'Straßenbahn': '#3C73A7', 'Bus': '#FD760A'};
    const MAX_WIDTH = '5xl';

    useEffect(() => {
        const graph_cookie = Number(Cookies.get('graph_tab'));
        if (graph_cookie && !isNaN(graph_cookie) && graph_cookie >= 1 && graph_cookie <= 3) setSelectedGraphTab(Number(graph_cookie.toFixed(0)) as any);

        let timerange_cookie = Cookies.get('tr_tab');
        if (!timerange_cookie || (timerange_cookie !== 'd' && timerange_cookie !== 'w' && timerange_cookie !== 'm' && timerange_cookie !== 'y')) timerange_cookie = 'd';

        getData(timerange_cookie as TabValues)
        // window.addEventListener('pageshow', () => getData(timerange_cookie as TabValues));
        setSelectedTab(timerange_cookie as TabValues);
    }, [])

    const handleTabSelection = (e: MouseEvent, id?: TabValues) => {
        const target_tab = id ?? 'd';
        Cookies.set('tr_tab', target_tab);
        setSelectedTab(target_tab);
        getData(target_tab);
    }

    const handelGraphTabSelection = (e: MouseEvent, id: 1 | 2 | 3) => {
        Cookies.set('graph_tab', id.toString());
        setSelectedGraphTab(id);
    }

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index}: {cx: number, cy: number, midAngle: number, innerRadius: number, outerRadius: number, index: number}) => {
        const radian = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
        const x = cx + radius * Math.cos(-midAngle * radian);
        const y = cy + radius * Math.sin(-midAngle * radian);

        return (<text x={x} y={y} fill={line_type_ranking_colors[index % 3]} textAnchor={ x > cx ? 'start' : 'end' } dominantBaseline="central" fontFamily='InterVariable' fontSize='12px' >{ reportLineTypesData[index].name }</text>);
    }

    const getData = (selected_timerange?: TabValues):void => {
        console.log('?');
        if (active_request) return;
        console.log('!');
        active_request = true;
        axios.get('/api/data', { params: { timerange: selected_timerange ?? selectedTab }, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'}})
        .then((res: AxiosResponse) => {
            if (res.status === 200)
            {
                setLastRequest(res.data.last_request);
                setStatData({
                    disruptions: {val: res.data.stats.nof_disturbances.val, change: res.data.stats.nof_disturbances.compare},
                    delays: {val: res.data.stats.nof_delays.val, change: res.data.stats.nof_delays.compare},
                    elevators: {val: res.data.stats.nof_elevators.val, change: res.data.stats.nof_elevators.compare },
                    total: { val: res.data.stats.nof_reports.val, change: res.data.stats.nof_reports.compare}
                });
                setReportHistoryData(res.data.report_history);
                setReportRankingData(res.data.report_ranking);
                setReportLineTypesData(res.data.report_line_types);
                setReportTypesData(res.data.report_types);
                setDisturbanceLengthData(res.data.disturbance_length);
                setDisturbanceMonthData(res.data.disturbance_months);
                if (!hasDataLoaded) setHasDataLoaded(true);
            }
        })
        .catch((e) => { console.log(e); request_toast(); })
        .finally(() => { active_request = false; })
    }

    const render = () => {

        let left_graph_box = undefined;
        let right_graph_box = undefined;

        if (selectedGraphTab === 1)
        {
            left_graph_box = (
                <GraphBox
                    width='calc(50% - 20px)'
                    height="240px"
                    title='Meldungsverlauf'
                    labels={[{ name : langData?.graphs.report_history.disturbances ?? '', color: '#EA0054'}, {name : langData?.graphs.report_history.delays ?? '', color: graph_blue}]}
                    hasDataLoaded={hasDataLoaded}
                    borderColor={borderColor}
                >
                    <ResponsiveContainer width="103%" height="87%">
                        <AreaChart
                            data={reportHistoryData}
                            style={{ marginLeft: '-20px' }}
                        >
                            <defs>
                                <linearGradient id="colorDisrupt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EA0054" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#EA0054" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorDelay" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={graph_blue} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={graph_blue} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} fontFamily="InterVariable" fontSize="12px" />
                            <YAxis axisLine={false} tickLine={false} fontFamily="InterVariable" fontSize="12px" />
                            <Area type="monotone" dataKey="disturbances" stackId="1" stroke="#FF0000" fill="url(#colorDisrupt)" fillOpacity={0.25} strokeWidth={2} />
                            <Area type="monotone" dataKey="delays" stackId="1" stroke={graph_blue} fill="url(#colorDelay)" fillOpacity={0.25} strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </GraphBox>
            );

            right_graph_box = (
                <GraphBox
                    width='calc(50% - 40px)'
                    height='240px'
                    title={langData?.graphs.report_ranking.title ?? ''}
                    hasDataLoaded={hasDataLoaded}
                    skeletonHeight='86%'
                    borderColor={borderColor}
                >
                    <ResponsiveContainer width="105%" height="87%" id="subway-ranking">
                        <ComposedChart
                            layout="vertical"
                            data={reportRankingData}
                            style={{ marginLeft: '-40px', marginTop: '25px' }}
                        >
                            <CartesianGrid horizontal={false} strokeDasharray="5" opacity={useColorModeValue(0.5, 0.2)} />
                            <XAxis type="number" axisLine={false} tickLine={false} fontFamily="InterVariable" fontSize="12px" />
                            <YAxis dataKey="name" type="category" scale="band" axisLine={false} tickLine={false} fontFamily="InterVariable" fontSize="12px" interval={0} />
                            <Bar dataKey="reports" barSize={20} radius={[0, 3, 3, 0]}>
                                <Cell key={'cell-0'} fill={useColorModeValue("#F49397", '#E40009')} fillOpacity={useColorModeValue(1, 0.3)} stroke="#E40009" strokeWidth={2} />
                                <Cell key={'cell-0'} fill={useColorModeValue("#ECC0E8", '#AA62A4')} fillOpacity={useColorModeValue(1, 0.3)} stroke="#AA62A4" strokeWidth={2} />
                                <Cell key={'cell-0'} fill={useColorModeValue("#FFDABC", '#FD750A')} fillOpacity={useColorModeValue(1, 0.3)} stroke="#FD760A" strokeWidth={2} />
                                <Cell key={'cell-0'} fill={useColorModeValue("#8BD7A4", '#049334')} fillOpacity={useColorModeValue(1, 0.3)} stroke="#049334" strokeWidth={2} />
                                <Cell key={'cell-0'} fill={useColorModeValue("#DEC3A3", '#9B692C')} fillOpacity={useColorModeValue(1, 0.3)} stroke="#9B692C" strokeWidth={2} />
                            </Bar>
                        </ComposedChart>
                    </ResponsiveContainer>
                </GraphBox>
            )
        }
        else if (selectedGraphTab === 2)
        {
            left_graph_box = (
                <GraphBox
                    width='calc(50% - 20px)'
                    height='240px'
                    title={langData?.graphs.report_causes.title ?? ''}
                    hasDataLoaded={hasDataLoaded}
                    skeletonHeight='86%'
                    borderColor={borderColor}
                >
                    <ResponsiveContainer width="105%" height="87%" id="request-ranking">
                        <RadarChart cx='50%' cy='50%' outerRadius='80%' data={reportTypesData}>
                            <PolarGrid strokeOpacity={useColorModeValue(1, 0.5)} />
                            <PolarAngleAxis dataKey="name" fontFamily='InterVariable' fontSize='12px' />
                            <Radar name="Meldeursachen" dataKey="reports" stroke={graph_blue} strokeWidth={2} color={'red'} fill={graph_blue} fillOpacity={useColorModeValue(0.6, 0.4)} />
                        </RadarChart>
                    </ResponsiveContainer>
                </GraphBox>
            );

            right_graph_box = (
                <GraphBox
                    width='calc(50% - 40px)'
                    height='240px'
                    title={langData?.graphs.report_line_types.title ?? ''}
                    hasDataLoaded={hasDataLoaded}
                    skeletonHeight='86%'
                    borderColor={borderColor}
                >
                    <ResponsiveContainer width="105%" height="87%" id="line_type_ranking">
                        <PieChart>
                            <Pie
                                data={reportLineTypesData}
                                cx='50%'
                                cy='50%'
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={80}
                                fillOpacity={0.2}
                                isAnimationActive={false}
                                dataKey="reports"
                            >
                                {
                                    reportLineTypesData.map((entry, idx) => {
                                        const color = line_type_ranking_colors[idx % 3];
                                        return <Cell key={idx} fill={color} fillOpacity={useColorModeValue(0.3, 0.1)} stroke={color} strokeWidth={2} />;
                                    })
                                }
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </GraphBox>
            )
        }
        else
        {
            left_graph_box = (
                <GraphBox
                    width='calc(50% - 20px)'
                    height='240px'
                    title={langData?.graphs.disturbance_lengths.title ?? ''}
                    labels={ [{name: langData?.graphs.disturbance_lengths.subway ?? '', color: '#EB4E87'}, { name: langData?.graphs.disturbance_lengths.tram ?? '', color: graph_blue }, { name: langData?.graphs.disturbance_lengths.bus ?? '', color: '#FD760A' }] }
                    hasDataLoaded={hasDataLoaded}
                    borderColor={borderColor}
                >
                    <ResponsiveContainer width="105%" height="87%" id="request-ranking">
                        <ScatterChart
                            style={{ marginLeft: '-20px' }}
                        >
                            <CartesianGrid strokeDasharray="5" opacity={useColorModeValue(0.5, 0.3)} />
                            <XAxis type="number" dataKey="x" tickLine={false} name="stature" fontFamily="InterVariable" fontSize="12px" />
                            <YAxis type="number" dataKey="y" tickLine={false} name="weight" fontFamily="InterVariable" fontSize="12px" />
                            <Scatter name="A school" data={disruptionLengthData} fill="#8884d8">
                                {
                                    disruptionLengthData.map((entry, idx) => (
                                        <Cell key={idx} fill={disruption_length_colors[entry.name as 'Straßenbahn' | 'U-Bahn' | 'Bus']} />
                                    ))
                                }
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </GraphBox>
            );

            right_graph_box = (
                <GraphBox
                    width='calc(50% - 40px)'
                    height="240px"
                    title={langData?.graphs.reports_month.title ?? ''}
                    labels={[{ name : langData?.graphs.reports_month.disturbances ?? '', color: '#EA0054'}, {name : langData?.graphs.reports_month.delays ?? '', color: graph_blue}]}
                    hasDataLoaded={hasDataLoaded}
                    borderColor={borderColor}
                >
                    <ResponsiveContainer width="103%" height="87%">
                        <AreaChart
                            data={disturbanceMonthData}
                            style={{ marginLeft: '-20px' }}
                        >
                            <defs>
                                <linearGradient id="colorDisrupt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EA0054" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#EA0054" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorDelay" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={graph_blue} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={graph_blue} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} fontFamily="InterVariable" fontSize="12px" />
                            <YAxis axisLine={false} tickLine={false} fontFamily="InterVariable" fontSize="12px" />
                            <Area type="monotone" dataKey="disturbances" stackId="1" stroke="#FF0000" fill="url(#colorDisrupt)" fillOpacity={0.25} strokeWidth={2} />
                            <Area type="monotone" dataKey="delays" stackId="1" stroke={graph_blue} fill="url(#colorDelay)" fillOpacity={0.25} strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </GraphBox>
            )
        };

        return (
            <>
                <Header
                    MAX_WIDTH={MAX_WIDTH}
                    purple={purple}
                    getData={getData}
                    hasDataLoaded={hasDataLoaded}
                    lastRequest={lastRequest}
                    requestToast={request_toast}
                    lang={lang}
                    setLang={setLang}
                />
                <Center marginTop="50px">
                    <Flex color="white" fontFamily="InterVariable" fontWeight="bold" fontSize="16px" justifyContent="space-between" userSelect="none">
                        <TabItem selected={selectedTab === 'd'} primColor={purple} onClick={handleTabSelection} id='d'>
                            { langData?.timerange.day }
                        </TabItem>
                        <TabItem selected={selectedTab === 'w'} primColor={purple} onClick={handleTabSelection} id='w'>
                            { langData?.timerange.week }
                        </TabItem>
                        <TabItem selected={selectedTab === 'm'} primColor={purple} onClick={handleTabSelection} id='m'>
                            { langData?.timerange.month }
                        </TabItem>
                        <TabItem selected={selectedTab === 'y'} primColor={purple} onClick={handleTabSelection} id='y' last>
                            { langData?.timerange.year }
                        </TabItem>
                    </Flex>
                </Center>
                <Container maxW={MAX_WIDTH} mt="75px">
                    <Flex justifyContent="space-between" fontFamily="InterVariable">
                        <StatItem id="stat-disturbances" label={ langData?.stats.disturbances } number={statData.disruptions.val} percentage={statData.disruptions.change} iconPath={AlertIcon} iconAlt={"Red alert icon"} hasDataLoaded={hasDataLoaded} borderColor={borderColor} />
                        <StatItem id="stat-delays" label={ langData?.stats.delays } number={statData.delays.val} percentage={statData.delays.change} iconPath={WarnIcon} iconAlt={"Yellow warn icon"} hasDataLoaded={hasDataLoaded} borderColor={borderColor} />
                        <StatItem id="stat-elevators" label={ langData?.stats.elevators } number={statData.elevators.val} percentage={statData.elevators.change} iconPath={ElevatorIcon} iconAlt={"Elevator symbole"} hasDataLoaded={hasDataLoaded} borderColor={borderColor} />
                        <StatItem id="stat-reports" label={ langData?.stats.reports } number={statData.total.val} percentage={statData.total.change} iconPath={ReportIcon} iconAlt={"Blue report symbole"} hasDataLoaded={hasDataLoaded} borderColor={borderColor} />
                    </Flex>
                </Container>
                <Container maxW={MAX_WIDTH} mt="70px" fontFamily="InterVariable" position="relative">
                    {
                        left_graph_box
                    }
                    <Flex
                        position="relative"
                        display="inline-flex"
                        height="240px"
                        margin="0 15px"
                        flexDirection="column"
                        justifyContent="center"
                        verticalAlign="middle"
                    >
                        <CircleSwitchItem primColor={purple} selected={selectedGraphTab === 1} id={1} onClick={handelGraphTabSelection} />
                        <CircleSwitchItem primColor={purple} selected={selectedGraphTab === 2} id={2} onClick={handelGraphTabSelection} mt="5px" />
                        <CircleSwitchItem primColor={purple} selected={selectedGraphTab === 3} id={3} onClick={handelGraphTabSelection} mt="5px" />
                    </Flex>
                    {
                        right_graph_box
                    }
                </Container>
                <Footer purple={purple} />
            </>
        )
    }

    return render();
};


export default App;

// React > 18.0.2
// const container = document.getElementById('root');
// if (container) createRoot(container).render(<App />)
