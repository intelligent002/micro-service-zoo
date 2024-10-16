pipeline {
    stages {
        stage ('Build') {
            steps {
                withEnv([]) {
                    sh '''
                        docker compose -f docker-compose-dev.yaml up --build
                        docker compose -f docker-compose-dev.yaml down
                    '''
                }
            }
        }
    }
}