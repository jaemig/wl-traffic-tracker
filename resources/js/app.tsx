import { Box, Center, ChakraProvider, Heading, useColorModeValue, Text, Flex, Image, Link, Container, HStack } from '@chakra-ui/react';
import React, { FC, MouseEvent, useState } from 'react';
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
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

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

const App: FC = () => {
    const [selectedTab, setSelectedTab] = useState<TabValues>('d');

    const purple = useColorModeValue('#040244', '#040244');
    const gentle_red = useColorModeValue('#EB4E87', '#EB4E87');
    const MAX_WIDTH = '5xl';

    const handleTabSelection = (e: MouseEvent, id?: TabValues) => {
        setSelectedTab(id ?? 'd');
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
                <Container maxW={MAX_WIDTH} mt="70px" fontFamily="InterVariable">
                    <Box
                        display="inline-block"
                        border="1px solid"
                        borderRadius="12px"
                        borderColor="gray.200"
                        mr="40px"
                        width="calc(50% - 20px)"
                        height="240px"
                        verticalAlign="top"
                        padding="10px"
                        _hover={{
                            transform: 'scale(1.01)',
                            boxShadow: '6px 6px 24px -6px rgba(0,0,0,0.15)'
                        }}
                        transition="all .15s ease"
                    >
                        <Heading fontSize="18px" fontWeight="medium">Meldungsverlauf</Heading>
                        <HStack spacing="15px">
                            <Box>
                                <Box borderRadius="full" bgColor="#EA0054" boxSize="10px" display="inline-block" />
                                <Text fontSize="12px" display="inline-block" ml="5px">Störungen</Text>
                            </Box>
                            <Box>
                                <Box borderRadius="full" bgColor="#00509D" boxSize="10px" display="inline-block" />
                                <Text fontSize="12px" display="inline-block" ml="5px">Verspätungen</Text>
                            </Box>
                        </HStack>
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
                    </Box>
                    <Box
                        display="inline-block"
                        border="1px solid"
                        borderRadius="12px"
                        borderColor="gray.200"
                        width="calc(50% - 20px)"
                        height="240px"
                        verticalAlign="top"
                        padding="10px"
                        _hover={{
                            transform: 'scale(1.01)',
                            boxShadow: '6px 6px 24px -6px rgba(0,0,0,0.15)'
                        }}
                        transition="all .15s ease"
                    >
                        <Heading fontSize="18px" fontWeight="medium">Melde-Ranking (U-Bahn)</Heading>
                    </Box>
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
