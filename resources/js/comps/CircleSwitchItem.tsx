import { Box, useColorMode } from "@chakra-ui/react";
import React, { FC, MouseEvent } from "react";
import { GraphTabIds } from "../types";

interface CircleSwitchItemProps {
    primColor: string
    selected?: boolean
    mt?: string
    id: GraphTabIds
    onClick?: {(e: MouseEvent<HTMLDivElement>, id: GraphTabIds): void}
    disabled?: boolean
}

/**
 * Clickable circle button that performs the specified action on click
 */
const CircleSwitchItem: FC<CircleSwitchItemProps> = ({ id, primColor, selected, mt, onClick, disabled = false }) => {

    const render = () => {
        const is_light_mode = useColorMode().colorMode === 'light';
        if (!is_light_mode) primColor = '#4B6992';
        return (
            <Box
                height="15px"
                width="15px"
                border={(selected ? '5' : '3') + 'px solid ' + primColor}
                mt={mt}
                borderRadius="full"
                onClick={(selected || !onClick || disabled) ? undefined : (e: MouseEvent<HTMLDivElement>) => onClick(e, id)}
                _hover={{ transform: 'scale(1.1)'}}
                transition="all .15s ease"
                cursor="pointer"
                opacity={disabled ? 0.3 : 1}
            />
        );
    }

    return render();
}

export default CircleSwitchItem;
