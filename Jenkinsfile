pipeline {
    agent {
        node {
            label 'linux'
        }
    }
    stages {
        stage('Start') {
            steps {
                script {
                    // Start the containers
                    sh '''
                        docker compose -f docker-compose-dev.yaml up --build -d
                    '''
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    // Initialize a loop that checks the container health status every 10 seconds
                    def maxAttempts = 12  // This allows up to 4 minutes of waiting (12 attempts with 20s sleep)
                    def attempt = 0
                    def healthy = false
                    def delay = 20 // sleep time

                    while (attempt < maxAttempts) {
                        echo "Attempt ${attempt + 1}/${maxAttempts}: Checking container health..."
                        def result = sh(script: '''
                            unhealthy_containers=$(docker ps --filter 'health=unhealthy' --format '{{.Names}}' | wc -l)
                            if [ "$unhealthy_containers" -eq 0 ]; then
                                echo "All containers are healthy."
                                exit 0
                            else
                                echo "Some containers are yet not healthy."
                                exit 1
                            fi
                        ''', returnStatus: true)

                        if (result == 0) {
                            healthy = true
                            break
                        }

                        attempt++
                        echo "Sleeping for ${delay} seconds before the next check ..."
                        sleep delay // Sleep for 20 seconds before the next check
                    }

                    // If containers are not healthy after the max attempts, fail the build
                    if (!healthy) {
                        def unhealthyCheck = sh(script: '''
                            docker ps --filter 'health=unhealthy' --format '{{.Names}}'
                        ''', returnStdout: true).trim()

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
