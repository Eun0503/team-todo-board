# 1. Argo CD 감시 목록에서 삭제하여 자동 복구(Auto-Healing) 방지
Write-Host "Removing team-todo-board Application from Argo CD..." -ForegroundColor Cyan
kubectl delete application team-todo-board -n argocd --ignore-not-found

# 2. Kubernetes 리소스 일괄 삭제 (서버 종료)
Write-Host "Deleting Kubernetes resources..." -ForegroundColor Cyan
kubectl delete -f k8s/
if ($LASTEXITCODE -ne 0) { 
    Write-Warning "Kubernetes resources deletion encountered some errors."
} else {
    Write-Host "Kubernetes resources deleted successfully." -ForegroundColor Green
}
