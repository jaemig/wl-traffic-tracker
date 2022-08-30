import { Box, useColorMode } from "@chakra-ui/react";
import React, { FC, MouseEvent } from "react";

interface ICircleSwitchItemProps {
    primColor: string;
    selected?: boolean;
    mt?: string;
    id: 1 | 2 | 3;
    onClick?: {(e: MouseEvent<HTMLDivElement>, id: 1 | 2 | 3): void};
}

const CircleSwitchItem: FC<ICircleSwitchItemProps> = ({ id, primColor, selected, mt, onClick }) => {

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
                onClick={(selected || !onClick) ? undefined : (e: MouseEvent<HTMLDivElement>) => onClick(e, id)}
                _hover={{ transform: 'scale(1.1)'}}
                transition="all .15s ease"
                cursor="pointer"
            />
        );
    }

    return render();
}

export default CircleSwitchItem;
