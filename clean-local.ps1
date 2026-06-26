# Kubernetes 리소스 일괄 삭제 (운영 중단)
Write-Host "Deleting Kubernetes resources..." -ForegroundColor Cyan
kubectl delete -f k8s/
if ($LASTEXITCODE -ne 0) { 
    Write-Warning "Kubernetes resources deletion encountered some errors."
} else {
    Write-Host "Kubernetes resources deleted successfully." -ForegroundColor Green
}
