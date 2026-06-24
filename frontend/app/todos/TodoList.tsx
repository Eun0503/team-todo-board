// 투두 목록 리스트 렌더링 및 빈 상태 처리 컴포넌트
import TodoItem from "./TodoItem";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  isEditing?: boolean;
}

interface TodoListProps {
  todos: Todo[];
  currentFilter: string;
  onToggleComplete: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onSaveEdit: (id: number, newTitle: string) => void;
  onCancelEdit: (id: number) => void;
  onEnableEditMode: (id: number) => void;
}

export default function TodoList({
  todos,
  currentFilter,
  onToggleComplete,
  onDeleteTodo,
  onSaveEdit,
  onCancelEdit,
  onEnableEditMode,
}: TodoListProps) {
  if (todos.length === 0) {
    let emptyText = "등록된 할 일이 없습니다.";
    if (currentFilter === "active") {
      emptyText = "진행 중인 할 일이 없습니다.";
    } else if (currentFilter === "completed") {
      emptyText = "완료된 할 일이 없습니다.";
    }

    return (
      <div className="flex items-center justify-center text-center min-h-[140px] p-6 text-slate-500 text-sm border border-dashed border-slate-200 rounded-lg select-none list-none">
        {emptyText}
      </div>
    );
  }

  return (
    <ul className="todo-list list-none flex flex-col gap-3 p-0 m-0">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDeleteTodo={onDeleteTodo}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onEnableEditMode={onEnableEditMode}
        />
      ))}
    </ul>
  );
}
