pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Replace with your repository URL
                git url: 'https://github.com/HarcheSamir/express-skeleton.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                // Build the image defined in your docker-compose file
                sh 'docker-compose build'
            }
        }
        stage('Run Container') {
            steps {
                // Bring up the container in detached mode
                sh 'docker-compose up -d'
            }
        }
    }
}
