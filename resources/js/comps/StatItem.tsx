import { Box, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Image, Text, Skeleton } from '@chakra-ui/react';
import React, { FC } from 'react';

interface StatItemProps {
    percentage: number
    borderColor: string,
    id?: string
    label?: string
    number?: number
    increase?: boolean
    iconPath?: any
    iconAlt?: string,
    hasDataLoaded?: boolean,
}

const StatItem: FC<StatItemProps> = ({ id, label, number, increase, percentage, iconPath, iconAlt, hasDataLoaded, borderColor }) => {

    const render = () => {
        return (
            <Stat
                id={id}
                border="1px solid"
                borderRadius="12px"
                borderColor={borderColor}
                maxWidth="210px"
                padding="23px 15px"
                _hover={{
                    transform: 'scale(1.05)',
                    boxShadow: '6px 6px 24px -6px rgba(0,0,0,0.255)'
                }}
                transition="all .15s ease"
            >
                <StatLabel>
                    <Text display="inline-block">{ label }</Text>
                    {
                        iconPath && <Image src={iconPath} boxSize="15px" display="inline-block" position="relative" ml="5px" top="2px" fill="red" alt={iconAlt} />
                    }
                </StatLabel>
                {
                    hasDataLoaded
                    ?
                    <StatNumber className='stat-item-value' fontWeight="600">{ number ?? '-' }</StatNumber>
                    : <Skeleton mt="5px" height="30px" width="75px"></Skeleton>
                }
                <StatHelpText>
                    {
                        hasDataLoaded
                        ? <>
                            <StatArrow type={ (increase || percentage && percentage >= 0) ? "increase" : "decrease"} /><span className='stat-item-percentage'>{ (percentage && !isNaN(percentage)) ? Math.abs(percentage) : '-' } </span>%
                          </>
                        : <Skeleton mt="10px" height="10px" width="75px"></Skeleton>
                    }
                </StatHelpText>
            </Stat>
        )
    }

    return render();
}


export default StatItem;
