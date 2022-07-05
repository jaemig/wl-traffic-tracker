import { Box, Center, ChakraProvider, Heading, useColorModeValue, Text, Flex, Image, Link, Container, HStack, Checkbox } from '@chakra-ui/react';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import TabItem from './comps/TabItem';
import { TabValues } from './constants';
import StatItem from './comps/StatItem';

import "@fontsource/montserrat/variable.css";
import "@fontsource/inter/variable.css";

import WienerLinien from '../assets/wiener_linien.svg';
import GitHub from '../assets/github.svg';
import AlertIcon from '../assets/alert_red.svg';
import WarnIcon from '../assets/alert_yellow.svg';
import ElevatorIcon from '../assets/elevator.png';
import EscalatorIcon from '../assets/escalator.png';
import { Area, AreaChart, Bar, CartesianGrid, Cell, ComposedChart, LabelList, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import CircleSwitchItem from './comps/CircleSwitchItem';
import GraphBox from './comps/GraphBox';
import Cookies from 'js-cookie';

const ex_chart_data = [
    {
      name: '1',
      uv: 4000,
      pv: 2400,
    },
    {
      name: '2',
      uv: 3000,
      pv: 1398,
    },
    {
      name: '3',
      uv: 2000,
      pv: 9800,
    },
    {
      name: '4',
      uv: 2780,
      pv: 3908,
    },
    {
      name: '5',
      uv: 1890,
      pv: 4800,
    },
    {
      name: '6',
      uv: 2390,
      pv: 3800,
    },
    {
      name: '7',
      uv: 3490,
      pv: 4300,
    },
  ];

const melde_ranking_data = [
{
    name: 'U1',
    uv: 590,
    pv: 800,
},
{
    name: 'U2',
    uv: 868,
    pv: 967,
},
{
    name: 'U3',
    uv: 1397,
    pv: 1098,
},
{
    name: 'U4',
    uv: 1480,
    pv: 1200,
},
{
    name: 'U6',
    uv: 1520,
    pv: 1108,
},
];


const request_ranking_data = [
    {
      subject: 'Math',
      A: 120,
      B: 110,
      fullMark: 150,
    },
    {
      subject: 'Chinese',
      A: 98,
      B: 130,
      fullMark: 150,
    },
    {
      subject: 'English',
      A: 86,
      B: 130,
      fullMark: 150,
    },
    {
      subject: 'Geography',
      A: 99,
      B: 100,
      fullMark: 150,
    },
    {
      subject: 'Physics',
      A: 85,
      B: 90,
      fullMark: 150,
    },
    {
      subject: 'History',
      A: 65,
      B: 85,
      fullMark: 150,
    },
];

const line_type_ranking_data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
];

const disruption_length_data = [
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
  ];

const disruption_timerange_data = [
    {
        "name": "0",
        "disruption": 26.607425219052327,
        "delay": 32.405815892482316
    },
    {
        "name": "1",
        "disruption": 25.20736262375062,
        "delay": 48.05101945242035
    },
    {
        "name": "2",
        "disruption": 28.394898176644524,
        "delay": 46.47085691202327
    },
    {
        "name": "3",
        "disruption": 31.65185373518512,
        "delay": 48.91590600780881
    },
    {
        "name": "4",
        "disruption": 27.023210054020307,
        "delay": 41.26937471778071
    },
    {
        "name": "5",
        "disruption": 36.20004580147613,
        "delay": 27.544083610896415
    },
    {
        "name": "6",
        "disruption": 38.885292114825546,
        "delay": 42.96156697752656
    },
    {
        "name": "7",
        "disruption": 29.59949978713714,
        "delay": 36.79792844030633
    },
    {
        "name": "8",
        "disruption": 29.09632770045838,
        "delay": 38.240637893996166
    },
    {
        "name": "9",
        "disruption": 26.77941839643751,
        "delay": 44.22966038419081
    },
    {
        "name": "10",
        "disruption": 32.13648684042911,
        "delay": 26.31184906440759
    },
    {
        "name": "11",
        "disruption": 31.030152665459266,
        "delay": 49.354323112594756
    },
    {
        "name": "12",
        "disruption": 34.697260423144,
        "delay": 42.90840678505417
    },
    {
        "name": "13",
        "disruption": 34.995012572659384,
        "delay": 41.57104334549709
    },
    {
        "name": "14",
        "disruption": 27.71637686701565,
        "delay": 45.14798368544685
    },
    {
        "name": "15",
        "disruption": 34.50600119355883,
        "delay": 33.722424394672835
    },
    {
        "name": "16",
        "disruption": 26.74067665162432,
        "delay": 29.25616320095394
    },
    {
        "name": "17",
        "disruption": 49.90944794066369,
        "delay": 28.367242112140694
    },
    {
        "name": "18",
        "disruption": 49.74594749582774,
        "delay": 30.39433928358935
    },
    {
        "name": "19",
        "disruption": 46.68752872739798,
        "delay": 34.97078883455171
    },
    {
        "name": "20",
        "disruption": 32.473742828504506,
        "delay": 41.66796952704968
    },
    {
        "name": "21",
        "disruption": 38.53624589637069,
        "delay": 27.811441535253252
    },
    {
        "name": "22",
        "disruption": 48.01751521759766,
        "delay": 25.137263421431815
    },
    {
        "name": "23",
        "disruption": 40.06361496380794,
        "delay": 31.248169076431854
    }
]

const App: FC = () => {
    const [selectedTab, setSelectedTab] = useState<TabValues>('d');
    const [selectedGraphTab, setSelectedGraphTab] = useState<1 | 2 | 3>(1);

    const purple = useColorModeValue('#040244', '#040244');
    const gentle_red = useColorModeValue('#EB4E87', '#EB4E87');
    const line_type_ranking_colors = ['#00509D', '#EA0054', '#FD760A'];
    const disruption_length_colors = ['#EB4E87', '#3C73A7', '#FD760A'];
    const MAX_WIDTH = '5xl';

    const handleTabSelection = (e: MouseEvent, id?: TabValues) => {
        const target_tab = id ?? 'd';
        Cookies.set('tr_tab', target_tab);
        setSelectedTab(target_tab);
    }

    const handelGraphTabSelection = (e: MouseEvent, id: 1 | 2 | 3) => {
        Cookies.set('graph_tab', id.toString());
        setSelectedGraphTab(id);
    }

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index}: {cx: number, cy: number, midAngle: number, innerRadius: number, outerRadius: number, index: number}) => {
        const radian = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.4;
        const x = cx + radius * Math.cos(-midAngle * radian);
        const y = cy + radius * Math.sin(-midAngle * radian);

        return (<text x={x} y={y} fill={line_type_ranking_colors[index % 3]} textAnchor={ x > cx ? 'start' : 'end' } dominantBaseline="central" fontFamily='InterVariable' fontSize='12px' >{ line_type_ranking_data[index].name }</text>);
    }

    useEffect(() => {
        const graph_cookie = Number(Cookies.get('graph_tab'));
        if (graph_cookie && !isNaN(graph_cookie) && graph_cookie >= 1 && graph_cookie <= 3) setSelectedGraphTab(Number(graph_cookie.toFixed(0)) as any);
        const timerange_cookie = Cookies.get('tr_tab');
        if (timerange_cookie && (timerange_cookie === 'd' || timerange_cookie === 'w' || timerange_cookie === 'm' || timerange_cookie === 'y')) setSelectedTab(timerange_cookie);
    }, [])

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
                            cursor="default"
                        >LAST UPDATE: 26.05.2022 10.30PM</Box>
                    </Flex>
                </Box>
                <Center marginTop="50px">
                    <Flex color="white" fontFamily="InterVariable" fontWeight="bold" fontSize="16px" justifyContent="space-between">
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
                        <StatItem label='Störungen' number={5} percentage="23.36" iconPath={AlertIcon} iconAlt={"Red alert icon"} increase />
                        <StatItem label='Verspätungen' number={8} percentage="8.05" iconPath={WarnIcon} iconAlt={"Yellow warn icon"} />
                        <StatItem label='Defekte Aufzüge' number={6} percentage="14.97" iconPath={ElevatorIcon} iconAlt={"Elevator symbole"} increase />
                        <StatItem label='Defekte Rolltreppen' number={14} percentage="11.25" iconPath={EscalatorIcon} iconAlt={"Escalator symbole with one person"} increase />
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
                            >
                                <ResponsiveContainer width="103%" height="87%">
                                    <AreaChart
                                        data={ex_chart_data}
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
                                        <Area type="monotone" dataKey="uv" stackId="1" stroke="#FF0000" fill="url(#colorDisrupt)" fillOpacity={0.25} strokeWidth={2} />
                                        <Area type="monotone" dataKey="pv" stackId="1" stroke="#00509D" fill="url(#colorDelay)" fillOpacity={0.25} strokeWidth={2} />
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
                            >
                                <ResponsiveContainer width="105%" height="87%" id="request-ranking">
                                    <RadarChart cx='50%' cy='50%' outerRadius='80%' data={request_ranking_data}>
                                        <PolarGrid enableBackground={'red'} />
                                        <PolarAngleAxis dataKey="subject" fontFamily='InterVariable' fontSize='12px' />
                                        <Radar name="Mike" dataKey="A" stroke="#00509D" strokeWidth={2} fill="#00509D" fillOpacity={0.6} />
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
                            >
                                <ResponsiveContainer width="105%" height="87%" id="request-ranking">
                                    <ScatterChart
                                        style={{ marginLeft: '-20px' }}
                                    >
                                        <CartesianGrid strokeDasharray="5" opacity={0.5} />
                                        <XAxis type="number" dataKey="x" tickLine={false} name="stature" fontFamily="InterVariable" fontSize="12px" />
                                        <YAxis type="number" dataKey="y" tickLine={false} name="weight" fontFamily="InterVariable" fontSize="12px" />
                                        <Scatter name="A school" data={disruption_length_data} fill="#8884d8">
                                            {
                                                disruption_length_data.map((entry, idx) => (
                                                    <Cell key={idx} fill={disruption_length_colors[idx % 3]} />
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
                            >
                                <ResponsiveContainer width="105%" height="87%" id="subway-ranking">
                                    <ComposedChart
                                        layout="vertical"
                                        data={melde_ranking_data}
                                        style={{ marginLeft: '-40px', marginTop: '25px' }}
                                    >
                                        <CartesianGrid horizontal={false} strokeDasharray="5" opacity={0.5} />
                                        <XAxis type="number" axisLine={false} tickLine={false} fontFamily="InterVariable" fontSize="12px" />
                                        <YAxis dataKey="name" type="category" scale="band" axisLine={false} tickLine={false} fontFamily="InterVariable" fontSize="12px" interval={0} />
                                        <Bar dataKey="uv" barSize={20} radius={[0, 3, 3, 0]}>
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
                            >
                                <ResponsiveContainer width="105%" height="87%" id="line_type_ranking">
                                    <PieChart>
                                        <Pie
                                            data={line_type_ranking_data}
                                            cx='50%'
                                            cy='50%'
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={80}
                                            fillOpacity={0.2}
                                            dataKey="value"
                                        >
                                            {
                                                line_type_ranking_data.map((entry, idx) => {
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
                            title='Störungen nach Uhrzeit'
                            labels={[{ name : 'Störungen', color: '#EA0054'}, {name : 'Verspätungen', color: '#00509D'}]}
                            >
                                <ResponsiveContainer width="103%" height="87%">
                                    <AreaChart
                                        data={disruption_timerange_data}
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
                                        <Area type="monotone" dataKey="disruption" stackId="1" stroke="#FF0000" fill="url(#colorDisrupt)" fillOpacity={0.25} strokeWidth={2} />
                                        <Area type="monotone" dataKey="delay" stackId="1" stroke="#00509D" fill="url(#colorDelay)" fillOpacity={0.25} strokeWidth={2} />
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
