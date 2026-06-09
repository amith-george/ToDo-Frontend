pipeline {
    agent any
    
    environment {
        IMAGE = "todo-frontend:${BUILD_NUMBER}"
        CONT = "todo-frontend"
    }
    
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        
        stage('Debug') {
            steps {
                bat 'echo IMAGE=%IMAGE%'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE% .'
            }
        }
        
        stage('Run Container') {
            steps {
                bat 'docker rm -f %CONT% || true'
                // Maps host port 8081 to the internal Nginx port 8081 we configured
                bat 'docker run -d --name %CONT% -p 8081:8081 %IMAGE%'
            }
        }
    }
}
