import { test, expect } from '@playwright/test';

test.describe('Weekly Todo Planner E2E', () => {
  test('해야 할 일 라이프사이클 (추가, 완료, 수정, 삭제, 날짜 이동)', async ({ page }) => {
    // 1. 앱 접속
    await page.goto('/');

    // 2. 투두 추가 테스트
    const input = page.getByPlaceholder('오늘 할 일을 입력하세요...');
    await input.fill('CI 자동화 테스트 투두');
    await input.press('Enter');

    // 생성되었는지 확인
    const todoItem = page.locator('li.todo-item').filter({ hasText: 'CI 자동화 테스트 투두' });
    await expect(todoItem).toBeVisible();

    // 3. 투두 완료 토글 테스트
    const completeButton = todoItem.getByRole('button', { name: '완료' });
    await completeButton.click();
    
    // 완료 상태(해제 버튼으로 바뀜) 확인
    await expect(todoItem.getByRole('button', { name: '해제' })).toBeVisible();

    // 4. 투두 수정 테스트
    const editButton = todoItem.getByRole('button', { name: '수정' });
    await editButton.click();
    
    // 수정 모드 진입 시 텍스트가 input 안으로 들어가 hasText 필터가 깨지므로 page 레벨에서 input을 찾습니다.
    const editInput = page.locator('input.edit-input').last();
    await editInput.fill('수정된 자동화 투두');
    await editInput.press('Enter');

    // 수정 반영 확인
    await expect(page.locator('text=수정된 자동화 투두')).toBeVisible();

    // 5. 날짜 이동 테스트 (다음 주 -> 첫째 날 선택 -> 다시 돌아와서 오늘 선택)
    const nextWeekBtn = page.getByRole('button', { name: '다음 주' });
    await nextWeekBtn.click();
    
    // 다음 주 첫 번째 요일 카드 클릭하여 선택 날짜 변경
    await page.locator('.week-days-container > div').first().click();
    
    // 날짜가 바뀌었으므로 방금 작성한 투두가 사라져야 함
    await expect(page.locator('text=수정된 자동화 투두')).toBeHidden();

    // 다시 이전 주로 돌아오기
    const prevWeekBtn = page.getByRole('button', { name: '이전 주' });
    await prevWeekBtn.click();

    // 오늘 날짜 카드 다시 클릭하여 투두 불러오기
    const todayDateStr = new Date().getDate().toString();
    const todaySpan = page.locator('span.text-sm.font-semibold').filter({ hasText: new RegExp(`^${todayDateStr}$`) });
    await todaySpan.click();

    // 원래 날짜로 돌아왔으니 투두가 다시 보여야 함
    await expect(page.locator('text=수정된 자동화 투두')).toBeVisible();

    // 6. 투두 삭제 테스트
    const updatedTodoItem = page.locator('li.todo-item').filter({ hasText: '수정된 자동화 투두' });
    const deleteButton = updatedTodoItem.getByRole('button', { name: '삭제' });
    await deleteButton.click();

    // 완전히 삭제되었는지 확인
    await expect(updatedTodoItem).toHaveCount(0);
  });
});
