# 1. SQLite 데이터 보존용 로컬 디렉터리 확인 및 생성
$dataPath = "C:\k8s-data\team-todo-board"
if (-not (Test-Path -Path $dataPath)) {
    Write-Host "Creating local data directory: $dataPath" -ForegroundColor Cyan
    New-Item -ItemType Directory -Force -Path $dataPath | Out-Null
} else {
    Write-Host "Local data directory already exists: $dataPath" -ForegroundColor Green
}

# 2. 로컬 개발용 도커 이미지 빌드
Write-Host "Building Backend Docker image..." -ForegroundColor Cyan
docker build -t eun0503/team-todo-board-backend:for-k8s ./backend
if ($LASTEXITCODE -ne 0) { 
    Write-Error "Backend image build failed."
    exit 1 
}

Write-Host "Building Frontend Docker image..." -ForegroundColor Cyan
docker build -t eun0503/team-todo-board-frontend:for-k8s ./frontend
if ($LASTEXITCODE -ne 0) { 
    Write-Error "Frontend image build failed."
    exit 1 
}

Write-Host "Docker images built successfully." -ForegroundColor Green

# 3. Kubernetes 매니페스트 적용 (배포)
Write-Host "Applying Kubernetes manifests..." -ForegroundColor Cyan
kubectl apply -f k8s/
if ($LASTEXITCODE -ne 0) { 
    Write-Error "Kubernetes resource deployment failed."
    exit 1 
}

Write-Host "Kubernetes resources applied successfully." -ForegroundColor Green

# 4. 현재 구동 리소스 상태 출력
Write-Host "Current Kubernetes Status:" -ForegroundColor Cyan
kubectl get all
