import { Box, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Image, Text } from '@chakra-ui/react';
import React, { FC } from 'react';

interface IStatItemProps {
    id?: string
    label?: string
    number?: number
    increase?: boolean
    percentage: string
    iconPath?: any
    iconAlt?: string
}

const StatItem: FC<IStatItemProps> = ({ id, label, number, increase, percentage, iconPath, iconAlt }) => {

    const render = () => {
        return (
            <Stat
                id={id}
                border="1px solid"
                borderRadius="12px"
                borderColor="gray.200"
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
                <StatNumber className='stat-item-value' fontWeight="600">{ number }</StatNumber>
                <StatHelpText>
                    <StatArrow type={increase ? "increase" : "decrease"} /><span className='stat-item-percentage'>{ percentage }</span>%
                </StatHelpText>
            </Stat>
        )
    }

    return render();
}


export default StatItem;
