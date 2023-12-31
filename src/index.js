import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeScript } from '@chakra-ui/react'
import { theme } from './theme';
import { BrowserRouter as Router } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // App is wrapped inside Chakra Provider, so that we can use all the chakra ui Component and utility classes
    <ChakraProvider>
        {/* set the iniitial colormode */}
        <ColorModeScript initialColorMode='theme.config.initialColorMode'/>
        <Router>
            <App />
        </Router>

    </ChakraProvider>
);