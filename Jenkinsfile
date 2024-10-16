pipeline {
    agent {
        node {
            label 'linux'
        }
    }
    stages {
        stage ('Build') {
            steps {
                withEnv([]) {
                    sh '''
                        docker compose -f docker-compose-dev.yaml up --build -d
                        docker compose -f docker-compose-dev.yaml down
                    '''
                }
            }
        }
    }
}