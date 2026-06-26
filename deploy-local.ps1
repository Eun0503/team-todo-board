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

# 4. 프론트엔드 서버가 구동 완료(Ready) 상태가 될 때까지 대기
Write-Host "Waiting for Frontend Pod to be ready..." -ForegroundColor Cyan
kubectl wait --for=condition=ready pod -l app=frontend --timeout=60s
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Frontend Pod took too long to start. Skipping automatic port-forwarding."
    exit 0
}

# 5. 브라우저 접속을 위해 자동으로 포트 포워딩 실행 (자동 재연결 루프 적용)
Write-Host "Starting automatic port-forwarding..." -ForegroundColor Green
Write-Host "Access URL: http://localhost:30081" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop port-forwarding and exit." -ForegroundColor Yellow

while ($true) {
    kubectl port-forward svc/frontend-svc 30081:80
    Write-Warning "Port-forwarding connection lost. Reconnecting in 1 second..."
    Start-Sleep -Seconds 1
}
