import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { loadConfig } from './config/config';

// Function to initialize and render the app
const initApp = async () => {
    const rootElement = document.getElementById('root');
    const root = ReactDOM.createRoot(rootElement!);

    // Render the app
    const renderApp = () => {
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    };

    // Render error message with retry option
    const renderError = (error: Error) => {
        console.error('Error during app initialization:', error);
        root.render(
            <div>
                <p>Error loading configuration. Please try again later.</p>
                <button onClick={initApp}>Retry</button>
            </div>
        );
    };

    try {
        // Display loading state while the config is being loaded
        root.render(<div>Loading...</div>);

        // Load config.json before rendering the app
        await loadConfig();

        // Render the app after config is loaded
        renderApp();
    } catch (error) {
        // Render error message if config loading fails
        renderError(error as Error);
    }
};

// Start the app initialization process
initApp().catch(error => {
    console.error('App initialization failed:', error);
});


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
