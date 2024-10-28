pipeline {
    agent {
        node {
            label 'linux'
        }
    }
    stages {
        stage('Start Containers') {
            steps {
                script {
                    // Start the containers
                    sh '''
                    sh '''
                        # Validate script existence
                        for script in zoo.start.sh zoo.stop.sh; do
                            if [ ! -f "$script" ]; then
                                echo "Error: Required script $script not found"
                                exit 1
                            fi
                        done

                        chmod +x zoo.start.sh zoo.stop.sh
                        # Verify permissions were set correctly
                        if [ ! -x "zoo.start.sh" ] || [ ! -x "zoo.stop.sh" ]; then
                            echo "Error: Failed to set execute permissions"
                            exit 1
                        fi

                        ./zoo.start.sh
                        if [ $? -ne 0 ]; then
                            echo "Error: Failed to start containers"
                            exit 1
                        fi
                    '''
                    '''
                }
            }
        }
        stage('Wait for Containers to Become Ready') {
            steps {
                script {
                    // Initialize variables for container status checks
                    def maxAttempts = 24  // This allows up to 2 minutes of waiting (24 attempts with 5s sleep)
                    def delay = 5 // Sleep time in seconds
                    def allContainersStarted = false
                    def startingContainers = ''

                    // Loop to wait for containers to exit "starting" state
                    for (int attempt = 0; attempt < maxAttempts; attempt++) {
                        echo "Attempt ${attempt + 1}/${maxAttempts}: Checking if containers are still starting..."

                        startingContainers = sh(script: '''
                            docker ps --filter 'health=starting' --format '{{.Names}}'
                        ''', returnStdout: true).trim()

                        if (startingContainers) {
                            echo "Containers still starting: ${startingContainers}"
                        } else {
                            echo "All containers have exited the 'starting' state."
                            allContainersStarted = true
                            break
                        }

                        sleep delay // Sleep for a few seconds before the next check
                    }

                    // Fail if containers are still in "starting" state after the maximum attempts
                    if (!allContainersStarted) {
                        error "Some containers are still in the 'starting' state after ${maxAttempts * delay} seconds: ${startingContainers}"
                    }
                }
            }
        }
        stage('Validate Container Health') {
            steps {
                script {
                    // Check if there are any unhealthy containers
                    def unhealthyContainers = sh(script: '''
                        docker ps --filter 'health=unhealthy' --format '{{.Names}}'
                    ''', returnStdout: true).trim()

                    if (unhealthyContainers) {
                        error "Unhealthy containers detected: ${unhealthyContainers}"
                    }

                    // If no unhealthy containers, the test passes
                    echo "All containers are healthy and running."
                }
            }
        }
    }
    post {
        always {
            // Bring down the containers after the check
            sh '''
                ./zoo.stop.sh
            '''
        }
    }
}
