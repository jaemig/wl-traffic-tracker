import { Box, Center, Text, Image, Link } from "@chakra-ui/react";
import React, { FC } from "react";

import WienerLinien from '../../assets/wiener_linien.svg';
import GitHub from '../../assets/github.svg';

interface FooterProps {
    purple: string
}

const Footer: FC<FooterProps> = ({ purple }) => {

    const render = () => {
        return (
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
        );
    }

    return render();
}

export default Footer;
