// 개별 투두 항목의 조회, 완료 체크, 삭제 및 인라인 수정 처리 컴포넌트
import { useState, useEffect, useRef } from "react";

interface TodoItemProps {
  todo: { id: number; title: string; completed: boolean; date?: string; isEditing?: boolean };
  onToggleComplete: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onSaveEdit: (id: number, newTitle: string) => void;
  onCancelEdit: (id: number) => void;
  onEnableEditMode: (id: number) => void;
}

export default function TodoItem({
  todo,
  onToggleComplete,
  onDeleteTodo,
  onSaveEdit,
  onCancelEdit,
  onEnableEditMode,
}: TodoItemProps) {
  const [editText, setEditText] = useState(todo.title);
  const [itemError, setItemError] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const [prevText, setPrevText] = useState(todo.title);
  const [prevIsEditing, setPrevIsEditing] = useState(todo.isEditing);

  if (todo.title !== prevText || todo.isEditing !== prevIsEditing) {
    setPrevText(todo.title);
    setPrevIsEditing(todo.isEditing);
    setEditText(todo.title);
    setItemError("");
  }

  useEffect(() => {
    if (todo.isEditing && editInputRef.current) {
      editInputRef.current.focus();
      const valueLength = editInputRef.current.value.length;
      editInputRef.current.setSelectionRange(valueLength, valueLength);
    }
  }, [todo.isEditing]);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed === "") {
      setItemError("할 일을 입력해주세요!");
      return;
    }
    setItemError("");
    onSaveEdit(todo.id, trimmed);
  };

  const handleCancel = () => {
    setItemError("");
    onCancelEdit(todo.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
    if (itemError) {
      setItemError("");
    }
  };

  return (
    <li className={`todo-item flex flex-col py-3 px-4 border border-slate-200 rounded-lg bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-shadow duration-200 gap-2 hover:shadow-md ${todo.completed ? "completed" : ""}`}>
      {todo.isEditing ? (
        <div className="flex flex-col w-full gap-2">
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="todo-left flex items-center gap-3 flex-1">
              <input
                ref={editInputRef}
                type="text"
                value={editText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="edit-input flex-1 py-1.5 px-3 text-sm border border-brand rounded-md outline-none"
              />
            </div>
            <div className="btn-group flex gap-1.5 shrink-0">
              <button
                onClick={handleSave}
                className="save-btn border-none py-1.5 px-3 text-xs font-medium rounded-md cursor-pointer bg-brand text-white transition-colors duration-200 hover:bg-brand-hover active:scale-95"
              >
                저장
              </button>
              <button
                onClick={handleCancel}
                className="border-none py-1.5 px-3 text-xs font-medium rounded-md cursor-pointer bg-slate-50 text-slate-500 transition-colors duration-200 hover:bg-slate-200 hover:text-slate-800 active:scale-95"
              >
                취소
              </button>
            </div>
          </div>
          {itemError && (
            <p className="text-red-500 text-xs pl-1 animate-fade-in">
              {itemError}
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="todo-left flex items-center gap-3 flex-1 min-w-0">
            <span className={`todo-text text-sm break-all text-slate-800 ${todo.completed ? "text-slate-500 line-through" : ""}`}>
              {todo.title}
            </span>
          </div>
          <div className="btn-group flex gap-1.5 shrink-0">
            <button
              onClick={() => onToggleComplete(todo.id)}
              className={`complete-btn border-none py-1.5 px-3 text-xs font-medium rounded-md cursor-pointer bg-slate-50 text-slate-500 transition-colors duration-200 hover:bg-slate-200 hover:text-slate-800 active:scale-95 ${
                todo.completed ? "bg-green-50! text-green-700!" : ""
              }`}
            >
              {todo.completed ? "해제" : "완료"}
            </button>
            <button
              onClick={() => onEnableEditMode(todo.id)}
              className="border-none py-1.5 px-3 text-xs font-medium rounded-md cursor-pointer bg-slate-50 text-slate-500 transition-colors duration-200 hover:bg-slate-200 hover:text-slate-800 active:scale-95"
            >
              수정
            </button>
            <button
              onClick={() => onDeleteTodo(todo.id)}
              className="delete-btn border-none py-1.5 px-3 text-xs font-medium rounded-md cursor-pointer bg-slate-50 text-slate-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-500 active:scale-95"
            >
              삭제
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
