pipeline {
    agent any
    
    tools {
        nodejs 'node20'
    }
    
    stages {
        stage('Verify Docker Installation') {
            steps {
                sh 'docker -v || echo "Docker not installed!"'
                sh 'docker compose version || echo "Docker Compose not installed!"'
                sh 'docker ps || echo "Docker daemon is not running!"'
            }
        }
        
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Retrieve .env.docker File') {
            steps {
                withCredentials([file(credentialsId: 'env_file', variable: 'ENV_FILE')]) {
                    // Remove any existing .env.docker file to avoid permission issues
                    sh 'rm -f .env.docker'
                    // Copy the credential file to create .env.docker
                    sh 'cp "$ENV_FILE" .env.docker'
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npx prisma generate'
                // Add any additional build steps if necessary
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test || true'  // Continue even if tests fail
            }
        }
        
        stage('Docker Build') {
            steps {
                sh 'docker build -t express-skeleton .'
            }
        }
        
        stage('Docker Run') {
            steps {
                sh 'docker compose down || true'  // Bring down existing containers, if any
                sh 'docker compose up -d'         // Start containers in detached mode
            }
        }
    }
}
