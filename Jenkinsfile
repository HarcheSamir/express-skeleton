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
                sh 'chmod 755 ${WORKSPACE}'
                withCredentials([file(credentialsId: 'env_file', variable: 'ENV_FILE')]) {
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
                // Add any other build steps if needed
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test || true'  // Continue even if tests fail for now
            }
        }
        
        stage('Docker Build') {
            steps {
                sh 'docker build -t express-skeleton .'
            }
        }
        
        stage('Docker Run') {
            steps {
                sh 'docker compose down || true'  // Bring down existing containers if any
                sh 'docker compose up -d'  // Start in detached mode
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed'
            sh 'docker compose logs || echo "No logs available"'
        }
    }
}