import { Badge, Box, Center, ChakraProvider, Container, Heading, Image, Link } from '@chakra-ui/react';
import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import Logo from "../assets/brand.png";
import GithubLogo from "../assets/github_mark.png";

const App: FC = () => {

    const render = () => {
        return (
            <ChakraProvider>
                <Box padding="10px 20px">
                    <Container flex="none">
                        <Center>
                            <Box display="block">
                                <Heading fontSize="3xl" display="inline-block" verticalAlign="middle" color="#1dd1a1">WL Traffic Tracker</Heading>
                            </Box>
                            <Box display="block">
                            </Box>
                        </Center>
                        <Center>

                        </Center>
                    </Container>
                </Box>
            </ChakraProvider>
        )
    }

    return render();
};

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
