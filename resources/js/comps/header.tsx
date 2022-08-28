import { Box, Flex, Heading, Text, Image, useColorMode } from "@chakra-ui/react";
import React, { FC } from "react";
import { TabValues } from "../constants";


// ICONS
import LightModeIcon from '../../assets/light_mode.svg';
import DarkModeIcon from '../../assets/dark_mode.svg';

interface IHeaderProps {
    purple: string,
    MAX_WIDTH: string,
    getData: (selected_timerange?: TabValues) => void,
    hasDataLoaded: boolean,
    lastRequest: string,
    colorMode: 'light' | 'dark',
    toggleColorMode: () => void
}

const Header: FC<IHeaderProps> = ({ MAX_WIDTH, purple, getData, hasDataLoaded, lastRequest, }) => {
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
                                onClick={() => getData()}
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

                        </Box>
                    </Flex>
                </Box>
        );
    }

    return render();
}

export default Header;
