// 신규 투두 입력 및 유효성 경고 메시지 표시 폼 컴포넌트
import { useState } from "react";

interface TodoFormProps {
  onAddTodo: (title: string) => void;
}

export default function TodoForm({ onAddTodo }: TodoFormProps) {
  const [todoText, setTodoText] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = todoText.trim();
    
    if (trimmed === "") {
      setFormError("할 일을 입력해주세요!");
      return;
    }

    setFormError("");
    //onAddTodo(trimmed);
    setTodoText("");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(event.target.value);
    if (formError) {
      setFormError("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.nativeEvent.isComposing) {
      event.preventDefault();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form mb-5">
      <div className="input-group flex gap-2">
        <input
          type="text"
          value={todoText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="오늘 할 일을 입력하세요..."
          autoComplete="off"
          className="flex-1 py-3 px-4 text-sm border border-slate-200 rounded-lg outline-none transition-all duration-200 focus:border-brand focus:ring-brand focus:ring-1"
        />
        <button
          type="submit"
          className="bg-brand hover:bg-brand-hover text-white border-none py-3 px-5 text-sm font-semibold rounded-lg cursor-pointer transition-colors duration-200 active:scale-98"
        >
          추가
        </button>
      </div>
      <p 
        className={`text-red-500 text-xs mt-2 h-4 transition-opacity duration-200 ${
          formError ? "opacity-100" : "opacity-0"
        }`}
      >
        {formError}
      </p>
    </form>
  );
}
