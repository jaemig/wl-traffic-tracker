import { ChakraProvider } from "@chakra-ui/react";
import React, { FC } from "react"
import ReactDOM from "react-dom";
import App from "./app";

const Provider: FC = () => {

    const render = () => (
        <ChakraProvider>
            <App />
        </ChakraProvider>
    )


    return render();
}

ReactDOM.render(
    <Provider />,
    document.getElementById('root')
)
