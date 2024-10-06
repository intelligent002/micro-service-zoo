import React, {useEffect, useState} from 'react';
import {ApolloProvider} from '@apollo/client';
import {getApolloClient} from './apollo-client';
import {BrowserRouter as Router} from 'react-router-dom';
import ProjectsList from './components/Project/ProjectsList'
import TasksList from "./components/Task/TasksList";
import './App.css';

function App() {
    // Separate useState hooks for client and selectedProjectId
    const [client, setClient] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    // Initialize Apollo Client after config is loaded
    useEffect(() => {
        const initApolloClient = async () => {
            const apolloClient = await getApolloClient();
            setClient(apolloClient);
        };
        initApolloClient();
    }, [setClient]);

    if (!client) {
        return <p>Loading...</p>; // Or a loading spinner
    }

    return (
        <ApolloProvider client={client}>
            <Router>
                <div className="App">
                    {/* Pass setSelectedProjectId as onSelect */}
                    <ProjectsList onSelect={setSelectedProjectId}/>
                    {selectedProjectId && <TasksList projectId={selectedProjectId}/>}
                </div>
            </Router>
        </ApolloProvider>
    );
}


export default App;
