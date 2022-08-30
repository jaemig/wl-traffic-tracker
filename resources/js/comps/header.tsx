import { Box, Flex, Heading, Text, Image, useColorMode, useToast } from "@chakra-ui/react";
import React, { FC } from "react";
import { TabValues } from "../types";


// ICONS
import LightModeIcon from '../../assets/light_mode.svg';
import DarkModeIcon from '../../assets/dark_mode.svg';

interface HeaderProps {
    purple: string,
    MAX_WIDTH: string,
    getData: (selected_timerange?: TabValues) => void,
    hasDataLoaded: boolean,
    lastRequest: string,
    requestToast: ReturnType<typeof useToast>
}

const Header: FC<HeaderProps> = ({ MAX_WIDTH, purple, getData, hasDataLoaded, lastRequest, requestToast }) => {
    const { colorMode, toggleColorMode } = useColorMode();

    const render = () => {
        return (
            <Box padding="10px 20px">
                    <Flex position="relative" left="50%" maxW={MAX_WIDTH} justifyContent="space-between" alignItems="center" transform="translateX(-50%)">
                        <Heading
                            fontSize="55px"
                            fontFamily="MontserratVariable"
                            fontWeight="bold"
                            display="inline-block"
                            color={colorMode === 'light' ? purple : '#D2CEC8'}
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
                            color="white"
                            fontFamily="InterVariable"
                            cursor="pointer"
                            >
                            <Box
                                id="last-request"
                                bgColor={purple}
                                fontWeight="bold"
                                fontSize="12px"
                                padding="5px 10px 5px 10px"
                                whiteSpace="nowrap"
                                onClick={() => {
                                    requestToast({
                                        status: 'success',
                                        title: 'Fetching data...'
                                    })
                                    getData();
                                }}
                                display="inline-block"
                                boxShadow="2px 4px 14px 0px rgba(12,8,151,0.4)"
                                borderRadius="5px"
                                _hover={{ transform: "scale(1.05)" }}
                                transition="all .15s ease"
                            >
                                LETZTES UPDATE:&nbsp;
                                {
                                    hasDataLoaded
                                    ? <span>{lastRequest}</span>
                                    : <Box display="inline-block" verticalAlign="middle" width="105px" height="15px" />
                                }
                            </Box>
                            <Box
                                bgColor={purple}
                                id="theme-toggle"
                                display="inline-block"
                                color="white"
                                ml="20px"
                                boxShadow="2px 4px 14px 0px rgba(12,8,151,0.4)"
                                padding="5px"
                                borderRadius="5px"
                                verticalAlign="middle"
                                _hover={{ transform: "scale(1.05)" }}
                                transition="all .15s ease"
                            >
                                {/* { colorMode } */}
                                <Image src={ colorMode === 'dark' ? LightModeIcon : DarkModeIcon} boxSize="15px" onClick={toggleColorMode}/>
                            </Box>
                        </Box>
                    </Flex>
                </Box>
        );
    }

    return render();
}

export default Header;
