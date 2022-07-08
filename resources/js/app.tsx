import { Box, Center, ChakraProvider, Heading, useColorModeValue, Text, Flex, Image, Link, Container, HStack, Checkbox } from '@chakra-ui/react';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import TabItem from './comps/TabItem';
import { TabValues } from './constants';
import StatItem from './comps/StatItem';
import axios, { AxiosResponse } from 'axios';

import "@fontsource/montserrat/variable.css";
import "@fontsource/inter/variable.css";

import WienerLinien from '../assets/wiener_linien.svg';
import GitHub from '../assets/github.svg';
import AlertIcon from '../assets/alert_red.svg';
import WarnIcon from '../assets/alert_yellow.svg';
import ElevatorIcon from '../assets/elevator.png';
import EscalatorIcon from '../assets/escalator.png';
import ReportIcon from '../assets/report.png';
import { Area, AreaChart, Bar, CartesianGrid, Cell, ComposedChart, LabelList, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import CircleSwitchItem from './comps/CircleSwitchItem';
import GraphBox from './comps/GraphBox';
import Cookies from 'js-cookie';

let active_request = false;

const App: FC = () => {
    const [selectedTab, setSelectedTab] = useState<TabValues>('d');
    const [selectedGraphTab, setSelectedGraphTab] = useState<1 | 2 | 3>(1);
    const [reportHistoryData, setReportHistoryData] = useState([
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
    const [reportRankingData, setReportRankingData] = useState([
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
    const [reportLineTypesData, setReportLineTypesData] = useState([
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
    const [reportTypesData, setReportTypesData] = useState([
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
    const [disruptionLengthData, setDisturbanceLengthData] = useState([
        { name: 'U-Bahn', x: 100, y: 200 },
        { name: 'U-Bahn', x: 120, y: 100 },
        { name: 'Straßenbahn', x: 170, y: 300 },
        { name: 'Straßenbahn', x: 140, y: 250 },
        { name: 'Bus', x: 150, y: 400 },
        { name: 'Bus', x: 110, y: 180 },
    ])
    const [disturbanceMonthData, setDisturbanceMonthData] = useState([
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

    const purple = useColorModeValue('#040244', '#040244');
    const gentle_red = useColorModeValue('#EB4E87', '#EB4E87');
    const line_type_ranking_colors = ['#00509D', '#EA0054', '#FD760A'];
    const disruption_length_colors = {'U-Bahn': '#EB4E87', 'Straßenbahn': '#3C73A7', 'Bus': '#FD760A'};
    const MAX_WIDTH = '5xl';

    useEffect(() => {
        const graph_cookie = Number(Cookies.get('graph_tab'));
        if (graph_cookie && !isNaN(graph_cookie) && graph_cookie >= 1 && graph_cookie <= 3) setSelectedGraphTab(Number(graph_cookie.toFixed(0)) as any);
        const timerange_cookie = Cookies.get('tr_tab');
        if (timerange_cookie && (timerange_cookie === 'd' || timerange_cookie === 'w' || timerange_cookie === 'm' || timerange_cookie === 'y'))
        {
            setSelectedTab(timerange_cookie);
            getData(timerange_cookie);
        }
    }, [])

    // useEffect(() => {
    //     getData();
    // }, [selectedTab, setSelectedTab])

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
        if (active_request) return;
        active_request = true;
        axios.get('/api/data', { params: { timerange: selected_timerange ?? selectedTab }, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'}})
        .then((res: AxiosResponse) => {
            if (res.status === 200)
            {
                console.log(res.data);
                const update_time_elmnt = document.querySelector<HTMLSpanElement>('#last-request span');
                if (update_time_elmnt) update_time_elmnt.textContent = res.data.last_request;

                const stat_disturbances = document.querySelector('#stat-disturbances .stat-item-value');
                if (stat_disturbances) stat_disturbances.textContent = res.data.nof_disturbances.val;
                const stat_delays = document.querySelector('#stat-delays .stat-item-value');
                if (stat_delays) stat_delays.textContent = res.data.nof_delays.val;
                const stat_elevators = document.querySelector('#stat-elevators .stat-item-value');
                if (stat_elevators) stat_elevators.textContent = res.data.nof_elevators.val;
                const stat_reports = document.querySelector('#stat-reports .stat-item-value');
                if (stat_reports) stat_reports.textContent = res.data.nof_reports.val;

                const stat_disturbances_compare = document.querySelector('#stat-disturbances .stat-item-percentage');
                if (stat_disturbances_compare) stat_disturbances_compare.textContent = res.data.nof_disturbances.compare;
                const stat_delays_compare = document.querySelector('#stat-delays .stat-item-percentage');
                if (stat_delays_compare) stat_delays_compare.textContent = res.data.nof_delays.compare;
                const stat_elevators_compare = document.querySelector('#stat-elevators .stat-item-percentage');
                if (stat_elevators_compare) stat_elevators_compare.textContent = res.data.nof_elevators.compare;
                const stat_reports_compare = document.querySelector('#stat-reports .stat-item-percentage');
                if (stat_reports_compare) stat_reports_compare.textContent = res.data.nof_reports.compare;

                setReportHistoryData(res.data.report_history);
                setReportRankingData(res.data.report_ranking);
                setReportLineTypesData(res.data.report_line_types);
                setReportTypesData(res.data.report_types);
                setDisturbanceLengthData(res.data.disturbance_length);
                setDisturbanceMonthData(res.data.disturbance_months);
                if (!hasDataLoaded) setHasDataLoaded(true);
            }
        })
        .catch(() => { })
        .finally(() => { active_request = false; })
    }

    const render = () => {
        return (
            <ChakraProvider>
                <Box padding="10px 20px">
                    <Flex position="relative" left="50%" maxW={MAX_WIDTH} justifyContent="space-between" alignItems="center" transform="translateX(-50%)">
                        <Heading
                            fontSize="55px"
                            fontFamily="MontserratVariable"
                            fontWeight="bold"
                            display="inline-block"
                            color={purple}
                            verticalAlign="middle"
                        >
                            <Text
                                display="inline-block"
                                position="relative"
                                top="-4px"
                                color="#EA2C00"
                                fontSize="41px"
                            >//</Text>
                            WLTT
                        </Heading>
                        <Box
                            id="last-request"
                            bgColor={purple}
                            color="white"
                            fontFamily="InterVariable"
                            fontWeight="bold"
                            fontSize="12px"
                            padding="5px 10px 5px 10px"
                            borderRadius="5px"
                            whiteSpace="nowrap"
                            boxShadow="2px 4px 14px 0px rgba(12,8,151,0.4)"
                            _hover={{
                                transform: "scale(1.1)"
                            }}
                            transition="all .15s ease"
                            cursor="pointer"
                            onClick={() => getData()}
                        >LETZTES UPDATE: <span>26.05.2022 10.30PM</span></Box>
                    </Flex>
                </Box>
                <Center marginTop="50px">
                    <Flex color="white" fontFamily="InterVariable" fontWeight="bold" fontSize="16px" justifyContent="space-between" userSelect="none">
                        <TabItem selected={selectedTab === 'd'} primColor={purple} onClick={handleTabSelection} id='d'>
                            Tag
                        </TabItem>
                        <TabItem selected={selectedTab === 'w'} primColor={purple} onClick={handleTabSelection} id='w'>
                            Woche
                        </TabItem>
                        <TabItem selected={selectedTab === 'm'} primColor={purple} onClick={handleTabSelection} id='m'>
                            Monat
                        </TabItem>
                        <TabItem selected={selectedTab === 'y'} primColor={purple} onClick={handleTabSelection}  id='y' disabled last>
                            Jahr
                        </TabItem>
                    </Flex>
                </Center>
                <Container maxW={MAX_WIDTH} mt="75px">
                    <Flex justifyContent="space-between" fontFamily="InterVariable">
                        <StatItem id="stat-disturbances" label='Störungen' number={5} percentage="23.36" iconPath={AlertIcon} iconAlt={"Red alert icon"} increase />
                        <StatItem id="stat-delays" label='Verspätungen' number={8} percentage="8.05" iconPath={WarnIcon} iconAlt={"Yellow warn icon"} />
                        <StatItem id="stat-elevators" label='Defekte Aufzüge' number={6} percentage="14.97" iconPath={ElevatorIcon} iconAlt={"Elevator symbole"} increase />
                        <StatItem id="stat-reports" label='Meldungen Gesamt' number={14} percentage="11.25" iconPath={ReportIcon} iconAlt={"Blue report symbole"} increase />
                    </Flex>
                </Container>
                <Container maxW={MAX_WIDTH} mt="70px" fontFamily="InterVariable" position="relative">
                    {
                        selectedGraphTab === 1 &&
                            <GraphBox
                                width='calc(50% - 20px)'
                                height="240px"
                                title='Meldungsverlauf'
                                labels={[{ name : 'Störungen', color: '#EA0054'}, {name : 'Verspätungen', color: '#00509D'}]}
                                hasDataLoaded={hasDataLoaded}
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
                                                <stop offset="5%" stopColor="#00509D" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#00509D" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontFamily="InterVariable" fontSize="12px" />
                                        <YAxis axisLine={false} tickLine={false} fontFamily="InterVariable" fontSize="12px" />
                                        <Area type="monotone" dataKey="disturbances" stackId="1" stroke="#FF0000" fill="url(#colorDisrupt)" fillOpacity={0.25} strokeWidth={2} />
                                        <Area type="monotone" dataKey="delays" stackId="1" stroke="#00509D" fill="url(#colorDelay)" fillOpacity={0.25} strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </GraphBox>
                    }
                    {
                        selectedGraphTab === 2 &&
                            <GraphBox
                                width='calc(50% - 20px)'
                                height='240px'
                                title='Meldeursachen'
                                hasDataLoaded={hasDataLoaded}
                                skeletonHeight='86%'
                            >
                                <ResponsiveContainer width="105%" height="87%" id="request-ranking">
                                    <RadarChart cx='50%' cy='50%' outerRadius='80%' data={reportTypesData}>
                                        <PolarGrid enableBackground={'red'} />
                                        <PolarAngleAxis dataKey="name" fontFamily='InterVariable' fontSize='12px' />
                                        <Radar name="Meldeursachen" dataKey="reports" stroke="#00509D" strokeWidth={2} fill="#00509D" fillOpacity={0.6} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </GraphBox>
                    }
                    {
                        selectedGraphTab === 3 &&
                            <GraphBox
                                width='calc(50% - 20px)'
                                height='240px'
                                title='Störungslängen'
                                labels={ [{name: 'U-Bahn', color: '#EB4E87'}, { name: 'Straßenbahn', color: '#3C73A7' }, { name: 'Bus', color: '#FD760A' }] }
                                hasDataLoaded={hasDataLoaded}
                            >
                                <ResponsiveContainer width="105%" height="87%" id="request-ranking">
                                    <ScatterChart
                                        style={{ marginLeft: '-20px' }}
                                    >
                                        <CartesianGrid strokeDasharray="5" opacity={0.5} />
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
                        selectedGraphTab === 1 &&
                            <GraphBox
                                width='calc(50% - 40px)'
                                height='240px'
                                title="Melde-Ranking (U-Bahn)"
                                hasDataLoaded={hasDataLoaded}
                                skeletonHeight='86%'
                            >
                                <ResponsiveContainer width="105%" height="87%" id="subway-ranking">
                                    <ComposedChart
                                        layout="vertical"
                                        data={reportRankingData}
                                        style={{ marginLeft: '-40px', marginTop: '25px' }}
                                    >
                                        <CartesianGrid horizontal={false} strokeDasharray="5" opacity={0.5} />
                                        <XAxis type="number" axisLine={false} tickLine={false} fontFamily="InterVariable" fontSize="12px" />
                                        <YAxis dataKey="name" type="category" scale="band" axisLine={false} tickLine={false} fontFamily="InterVariable" fontSize="12px" interval={0} />
                                        <Bar dataKey="reports" barSize={20} radius={[0, 3, 3, 0]}>
                                            <Cell key={'cell-0'} fill="#F49397" stroke="#E40009" strokeWidth={2} />
                                            <Cell key={'cell-0'} fill="#ECC0E8" stroke="#AA62A4" strokeWidth={2} />
                                            <Cell key={'cell-0'} fill="#FFDABC" stroke="#FD760A" strokeWidth={2} />
                                            <Cell key={'cell-0'} fill="#8BD7A4" stroke="#049334" strokeWidth={2} />
                                            <Cell key={'cell-0'} fill="#DEC3A3" stroke="#9B692C" strokeWidth={2} />
                                        </Bar>
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </GraphBox>
                    }
                    {
                        selectedGraphTab === 2 &&
                            <GraphBox
                                width='calc(50% - 40px)'
                                height='240px'
                                title='Meldungen nach Linientyp'
                                hasDataLoaded={hasDataLoaded}
                                skeletonHeight='86%'
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
                                                    return <Cell key={idx} fill={color} stroke={color} strokeWidth={2} />;
                                                })
                                            }
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </GraphBox>
                    }
                    {
                        selectedGraphTab === 3 &&
                            <GraphBox
                            width='calc(50% - 40px)'
                            height="240px"
                            title='Störungen nach Monat'
                            labels={[{ name : 'Störungen', color: '#EA0054'}, {name : 'Verspätungen', color: '#00509D'}]}
                            hasDataLoaded={hasDataLoaded}
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
                                                <stop offset="5%" stopColor="#00509D" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#00509D" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontFamily="InterVariable" fontSize="12px" />
                                        <YAxis axisLine={false} tickLine={false} fontFamily="InterVariable" fontSize="12px" />
                                        <Area type="monotone" dataKey="disturbances" stackId="1" stroke="#FF0000" fill="url(#colorDisrupt)" fillOpacity={0.25} strokeWidth={2} />
                                        <Area type="monotone" dataKey="delays" stackId="1" stroke="#00509D" fill="url(#colorDelay)" fillOpacity={0.25} strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </GraphBox>
                    }
                </Container>
                <Box position="absolute" bottom="0" left="0" width="100%" height="90px" bgColor={purple}>
                    <Box position="absolute" top="0" left="50%" width="4xl" height="100%" transform="translateX(-50%)">
                        <Box position="relative" top="50%" transform="translateY(-50%)" color="white" fontFamily="InterVariable" fontWeight="bold" fontSize="12px">
                            <Box position="relative" left="50%" display="inline-block" transform="translateX(-50%)" cursor="default">
                                <Center mb="10px">
                                    <Text opacity="0.3" _hover={{ opacity: 1 }} transition="all .15s ease">This site is in no way affiliated with Wiener Linien GmbH & Co KG</Text>
                                </Center>
                                <Center>
                                    <Text opacity="0.3" _hover={{ opacity: 1 }} transition="all .15s ease">There is no guarantee regarding the correctness and currency of the displayed data.</Text>
                                </Center>
                            </Box>
                            <Box position="absolute" right="0" top="50%" transform="translateY(-50%)" >
                                <Link href="https://www.wienerlinien.at/eportal3/ep/programView.do?pageTypeId=66526&channelId=-46588&programId=69817" target="_blank" _active={{ outline: 0 }} _focus={{ outline: 0 }}>
                                    <Image src={WienerLinien} boxSize="20px" display="inline-block" opacity="0.3" _hover={{ opacity: 1 }} transition="all .15s ease" alt="Official logo of Wiener Linien" />
                                </Link>
                                <Link href="https://github.com/Jan-Emig/wl-traffic-tracker" target="_blank" _active={{ outline: 0 }} _focus={{ outline: 0 }}>
                                    <Image src={GitHub} boxSize="20px" display="inline-block" marginLeft="10px" opacity="0.3" _hover={{ opacity: 1 }} alt="Official GitHub logo" transition="all .15s ease" />
                                </Link>
                            </Box>
                        </Box>
                    </Box>
                    <Box position="relative" cursor="default">
                    </Box>
                </Box>
            </ChakraProvider>
        )
    }

    return render();
};


ReactDOM.render(
    <App />,
    document.getElementById('root')
)

// React > 18.0.2
// const container = document.getElementById('root');
// if (container) createRoot(container).render(<App />)
