import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import React, { FC, ReactNode } from "react";


interface IGraphBoxProps {
    width: string
    height: string
    title: string
    labels?: { name: string; color: string; }[]
    children?: React.ReactNode
}

const GraphBox: FC<IGraphBoxProps> = ({ width, height, title, labels, children }) => {

    const render = () => {

        let label_output: ReactNode = null;
        if (labels && labels.length > 0) {
            label_output = (
                <HStack spacing="15px">
                    {
                        labels.map((label, idx) => (
                            <Box key={idx}>
                                <Box
                                    display="inline-block"
                                    borderRadius="full"
                                    bgColor={label.color}
                                    boxSize="10px"
                                />
                                <Text
                                    display="inline-block"
                                    fontSize="12px"
                                    ml="5px"
                                >
                                    { label.name }
                                </Text>
                            </Box>
                        ))
                    }
                </HStack>
            )
        }

        return (
            <Box
                display="inline-block"
                width={width}
                height={height}
                border="1px solid"
                borderRadius="12px"
                borderColor="gray.200"
                _hover={{
                    transform: 'scale(1.01)',
                    boxShadow: '6px 6px 24px -6px rgba(0,0,0,0.15)'
                }}
                padding="10px"
                verticalAlign="middle"
                overflow="hidden"
                transition="all .15s ease"
            >
                <Heading fontSize="18px" fontWeight="medium">{ title }</Heading>
                { label_output }
                { children }
            </Box>
        )
    }

    return render();
}

export default GraphBox;
