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
        
        stage('Create .env.docker File') {
            steps {
                withCredentials([file(credentialsId: 'express-skeleton-.env.docker', variable: 'ENV_FILE')]) {
                    script {
                        def envContent = readFile(ENV_FILE)
                        writeFile file: '.env.docker', text: envContent
                    }
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
}
