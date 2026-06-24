// 투두 플래너 상태 및 CRUD 비즈니스 로직 총괄 컨테이너
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import axios from "axios";
import TodoHeader from "./TodoHeader";
import WeeklyNavigator from "./WeeklyNavigator";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import { formatDateString, getMonday } from "../utils/date";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  date?: string;
  isEditing?: boolean;
}

interface PlannerContainerProps {
  initialTodos: Todo[];
  allTodos: Todo[];
}

export default function PlannerContainer({ initialTodos, allTodos }: PlannerContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL에서 필터 상태 가져오기
  const currentFilter = searchParams.get("filter") || "all";

  const [todos, setTodos] = useState<Todo[]>(allTodos);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(initialTodos);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  // Hydration 완화를 위한 기본값 설정
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekStartDate, setWeekStartDate] = useState<Date>(getMonday(new Date()));

  // 1. 컴포넌트 마운트 후 로컬스토리지 복원 (hydration mismatch 방지)
  useEffect(() => {
    const savedSelectedDate = localStorage.getItem("selectedDate");
    const savedWeekStartDate = localStorage.getItem("weekStartDate");
    if (savedSelectedDate) {
      setSelectedDate(new Date(savedSelectedDate));
    }
    if (savedWeekStartDate) {
      setWeekStartDate(new Date(savedWeekStartDate));
    }
  }, []);

  // 2. 선택 날짜 및 주간 시작일 로컬스토리지 갱신
  useEffect(() => {
    localStorage.setItem("selectedDate", selectedDate.toISOString());
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem("weekStartDate", weekStartDate.toISOString());
  }, [weekStartDate]);

  // 3. 서버에서 데이터를 가져온 경우(Prop 변경 시) State 갱신
  useEffect(() => {
    setTodos(allTodos);
  }, [allTodos]);

  useEffect(() => {
    setFilteredTodos(initialTodos);
  }, [initialTodos]);

  // DB 연동 API 전체 리패치
  const refreshTodos = async () => {
    try {
      const res = await axios.get<Todo[]>("/api/todos");
      setTodos(res.data);
      router.refresh();
    } catch (error) {
      console.error("데이터를 가져오는 중 오류가 발생했습니다.", error);
    }
  };

  // 할 일 추가 핸들러
  const handleAddTodo = async (title: string) => {
    try {
      await axios.post("/api/todos", {
        title,
        date: formatDateString(selectedDate),
      });
      router.refresh();
    } catch (error) {
      console.error("할 일을 추가하지 못했습니다.", error);
    }
  };

  // 완료 상태 토글 핸들러
  const handleToggleComplete = async (id: number) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;
    try {
      // 낙관적 업데이트
      setFilteredTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
      await axios.put(`/api/todos/${id}`, {
        completed: !target.completed,
      });
      router.refresh();
    } catch (error) {
      console.error("완료 상태를 변경하지 못했습니다.", error);
      await refreshTodos();
    }
  };

  // 할 일 삭제 핸들러
  const handleDeleteTodo = async (id: number) => {
    try {
      setFilteredTodos((prev) => prev.filter((t) => t.id !== id));
      setTodos((prev) => prev.filter((t) => t.id !== id));
      await axios.delete(`/api/todos/${id}`);
      router.refresh();
    } catch (error) {
      console.error("할 일을 삭제하지 못했습니다.", error);
      await refreshTodos();
    }
  };

  // 수정 모드 활성화 핸들러
  const handleEnableEditMode = (id: number) => {
    setEditingTodoId(id);
  };

  // 수정 취소 핸들러
  const handleCancelEdit = (id: number) => {
    setEditingTodoId(null);
  };

  // 수정 내용 저장 핸들러
  const handleSaveEdit = async (id: number, newTitle: string) => {
    try {
      setFilteredTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
      );
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
      );
      setEditingTodoId(null);
      await axios.put(`/api/todos/${id}`, {
        title: newTitle,
      });
      router.refresh();
    } catch (error) {
      console.error("수정 내용을 저장하지 못했습니다.", error);
      await refreshTodos();
    }
  };

  // 필터 파라미터 업데이트 핸들러
  const handleFilterChange = (filter: "all" | "active" | "completed") => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // 날짜별 필터링 계산 (필터링은 이미 서버 단에서 처리되어 initialTodos에 반영됨)
  const targetDateStr = formatDateString(selectedDate);
  const displayTodos = filteredTodos
    .filter((todo) => todo.date === targetDateStr)
    .map((todo) => ({
      ...todo,
      isEditing: editingTodoId === todo.id,
    }));

  return (
    <div className="todo-container bg-white w-full max-w-[480px] p-8 rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.02)]">
      {/* 1. 헤더 */}
      <TodoHeader />

      {/* 2. 주간 네비게이터 */}
      <WeeklyNavigator
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        weekStartDate={weekStartDate}
        setWeekStartDate={setWeekStartDate}
        todos={todos}
      />

      {/* 3. 투두 추가 입력 폼 */}
      <TodoForm onAddTodo={handleAddTodo} />

      {/* 4. 상태별 필터 탭 영역 */}
      <div className="filter-container flex gap-1.5 mb-6 bg-slate-100 p-1 rounded-xl border border-slate-200">
        {(["all", "active", "completed"] as const).map((filter) => {
          const filterLabels = { all: "전체", active: "진행 중", completed: "완료" };
          const isActive = currentFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`flex-1 border-none py-2 px-3 text-xs font-medium rounded-lg cursor-pointer transition-all duration-200 active:scale-98 ${isActive
                  ? "bg-white text-brand font-semibold shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
                  : "text-slate-500 hover:text-slate-800"
                }`}
            >
              {filterLabels[filter]}
            </button>
          );
        })}
      </div>

      {/* 5. 투두 리스트 목록 */}
      <main className="todo-main">
        <TodoList
          todos={displayTodos}
          currentFilter={currentFilter}
          onToggleComplete={handleToggleComplete}
          onDeleteTodo={handleDeleteTodo}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onEnableEditMode={handleEnableEditMode}
        />
      </main>
    </div>
  );
}
