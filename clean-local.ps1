# Kubernetes Deployment의 복제본(Pod) 개수를 0개로 축소 (실물 서버 컨테이너만 정지)
Write-Host "Scaling down local deployments to 0 replicas..." -ForegroundColor Cyan
kubectl scale deployment/backend --replicas=0
kubectl scale deployment/frontend --replicas=0

Write-Host "Local servers scaled down successfully. Only Pods are terminated." -ForegroundColor Green
