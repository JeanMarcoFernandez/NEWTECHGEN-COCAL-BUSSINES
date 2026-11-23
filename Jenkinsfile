pipeline {
    agent any

    options {
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Retrieving project source code...'
                checkout scm
            }
        }

        stage('Validate Docker') {
            steps {
                bat 'docker --version'
                bat 'docker compose version'
            }
        }

        stage('Build') {
            steps {
                echo 'Building Docker images...'

                bat 'docker compose build frontend backend backend-test'
            }
        }

        stage('Test') {
            steps {
                echo 'Running backend unit tests with Jest...'

                bat 'docker compose run --rm backend-test'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'

                bat 'docker compose up -d --remove-orphans'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Checking running containers...'

                bat 'docker compose ps'
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully!'
            echo 'Frontend: http://localhost:8200'
            echo 'Backend: http://localhost:3000'
        }

        failure {
            echo 'Pipeline failed. Check the Jenkins console output.'
            bat 'docker compose ps'
        }
    }
}
