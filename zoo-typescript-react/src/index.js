import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {loadConfig} from './config/config.ts';


// Function to initialize and render the app
const initApp = async () => {
    try {
        // Load config.json before rendering the app
        await loadConfig();

        // Get the root element to render into
        const rootElement = document.getElementById('root');

        // React 18: createRoot instead of render
        const root = ReactDOM.createRoot(rootElement);

        // Render the app using root.render()
        root.render(
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        );
    } catch (error) {
        console.error('Error during app initialization:', error);

        // Handle error rendering if config loading fails
        const rootElement = document.getElementById('root');
        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <div>Error loading configuration. Please try again later.</div>
        );
    }
};

// Start the app initialization process
initApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
