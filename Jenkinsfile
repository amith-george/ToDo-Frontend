pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy Frontend') {
            steps {
                // Ensures the external network exists before compose tries to attach to it
                bat "docker network create todo-net 2>nul || exit 0"
                
                // Spin up the frontend using Compose
                bat "docker compose up -d --build"
            }
        }
    }
}
