export interface Config {
    apiUrl: string;
    featureFlagX: boolean;
}

let config: Config = {
    apiUrl: '',
    featureFlagX: false,
};

let isConfigLoaded = false;  // Track if config is already loaded
let configPromise: Promise<void> | null = null;  // Store the promise if config is being loaded

// Function to load config.json if it hasn't been loaded yet
export const loadConfig = async (): Promise<void> => {
    // If config is already loaded, just return
    if (isConfigLoaded) {
        return;
    }

    // If loading is in progress, return the existing promise to avoid multiple fetches
    if (configPromise) {
        return configPromise;
    }

    // Otherwise, start loading and store the promise
    configPromise = (async () => {
        try {
            const response = await fetch('/config.json');  // Fetch config from the public folder
            const jsonConfig = await response.json();

            // Assign the loaded config
            config = {
                apiUrl: jsonConfig.apiUrl,
                featureFlagX: jsonConfig.featureFlagX,
            };

            isConfigLoaded = true;  // Mark config as loaded
        } catch (error) {
            console.error('Error loading config.json:', error);
            throw new Error('Failed to load configuration');
        } finally {
            configPromise = null;  // Clear the promise after loading
        }
        console.log('config is loaded:'+config)
    })();

    return configPromise;
};

// Function to get the loaded config
export const getConfig = (): Config => {
    if (!isConfigLoaded) {
        throw new Error('Config has not been loaded yet. Make sure to call loadConfig first.');
    }
    return config;
};
