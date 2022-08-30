import { Box, useColorMode, useColorModeValue } from '@chakra-ui/react';
import React, { FC, MouseEvent } from 'react';
import { TabValues } from '../constants';

interface ITabItemProps {
    primColor: string
    selected?: boolean
    disabled?: boolean
    children?: React.ReactNode
    id: TabValues
    last?: boolean
    onClick?: {(e: MouseEvent, id?: TabValues): void}
}

const TabItem: FC<ITabItemProps> = ({ primColor, selected, disabled, children, id, last, onClick}) => {

    const render = () => {
        const is_light_mode = useColorMode().colorMode === 'light';
        if (disabled) primColor = "#000";
        if (!is_light_mode) primColor = '#4B6992';
        return (
            <Box
                position="relative"
                bgColor={(selected && is_light_mode) ? (primColor) : undefined}
                color={
                    selected
                        ? useColorModeValue('whiteAlpha.900', 'whiteAlpha.800')
                        : useColorModeValue(primColor, '#4B6992')
                }
                border={'3px solid ' + (is_light_mode && selected ? primColor : '#3a506e')}
                opacity={disabled ? 0.2 : undefined}
                marginRight={ !last ? "20px" : undefined}
                borderRadius="10px"
                padding="10px 35px"
                cursor={disabled ? undefined : "pointer"}
                boxShadow={selected ? ' 0px 0px 14px 0px rgba(4,2,68,0.35)' : undefined}
                transform={selected ? 'scale(1.05)' : undefined}
                _after={
                    selected
                    ? {
                        content: '""',
                        position: "absolute",
                        top: '2.5px',
                        left: '2.5px',
                        width: 'calc(100% - 5px)',
                        height: 'calc(100% - 5px)',
                        borderRadius: '7px',
                        border: (is_light_mode ? '2px solid white' : ''),
                        boxShadow: "0px 0px 14px 0px rgba(4,2,68,0.35)"
                    }
                    : undefined
                }
                _hover={ disabled ? undefined : {
                    transform: 'scale(1.05)'
                }}
                onClick={disabled || selected || !onClick ? undefined : (e: MouseEvent) => onClick(e, id)}
                transition="all .15s ease"
            >{ children }
            </Box>
        )
    }

    return render();
}


export default TabItem;
