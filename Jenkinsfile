pipeline {
    agent {
        node {
            label 'linux'
        }
    }
    stages {
        stage('Build') {
            steps {
                withEnv([]) {
                    script {
                        // Start the containers
                        sh '''
                            docker compose -f docker-compose-dev.yaml up --build -d
                        '''
                        
                        // Wait for containers to become healthy
                        timeout(time: 2, unit: 'MINUTES') {
                            waitUntil {
                                def healthy = sh(script: '''
                                    unhealthy_containers=$(docker ps --filter 'health=unhealthy' --format '{{.Names}}' | wc -l)
                                    if [ "$unhealthy_containers" -eq 0 ]; then
                                        echo "All containers are healthy."
                                        exit 0
                                    else
                                        echo "Some containers are unhealthy."
                                        exit 1
                                    fi
                                ''', returnStatus: true)
                                
                                return (healthy == 0)
                            }
                        }

                        // Check if there are any unhealthy containers and fail the pipeline if necessary
                        def unhealthyCheck = sh(script: '''
                            docker ps --filter 'health=unhealthy' --format '{{.Names}}'
                        ''', returnStdout: true).trim()

                        if (unhealthyCheck) {
                            error "Unhealthy containers detected: ${unhealthyCheck}"
                        }
                    }
                }
            }
        }
        post {
            always {
                // Bring down the containers after the check
                sh '''
                    docker compose -f docker-compose-dev.yaml down
                '''
            }
        }
    }
}
