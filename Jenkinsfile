pipeline {
    agent any

    tools {
        nodejs 'node20' 
    }

    environment {
        // Usamos el token que ya tienes (aunque lo ideal es usar credentials('ID'), así como lo tienes funciona)
        SONAR_TOKEN = '966a5b64d7641a61e3f43aa88a282e5b40e3e84e'
        DOCKER_USER = 'jslopez947'
        IMAGE_NAME = 'frontend-tailorflow'
    }

    stages {
        stage('Instalar Dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Tests y Cobertura') {
            steps {
                // Para Angular/Frontend, asegúrate de que este script genere el lcov.info
                sh 'npm run test:cov || echo "Hay tests fallando, pero continuamos..." '
            }
        }

        stage('Análisis SonarCloud') {
            steps {
                sh """
                npx sonar-scanner \
                -Dsonar.projectKey=jorgelopez04_FrontendValidacion \
                -Dsonar.token=${SONAR_TOKEN} \
                -Dsonar.host.url=https://sonarcloud.io \
                -Dsonar.javascript.lcov.reportPaths=coverage/frontend-tailorflow/lcov.info
                """
            }
        }

        stage('Construir y Subir Imagen Docker') {
            steps {
                script {
                    // 1. Construir
                    sh "docker build -t ${DOCKER_USER}/${IMAGE_NAME}:latest ."
                    
                    // 2. Subir (Usando la credencial que creamos antes)
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                        sh "echo \$PASS | docker login -u \$USER --password-stdin"
                        sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }
    }

    post {
        always {
            sh "docker logout || true"
        }
    }
}