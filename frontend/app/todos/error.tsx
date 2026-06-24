// 투두 플래너 에러 처리 화면 (에러 메시지 표기 및 재시도 기능 제공)
"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="todo-container bg-white w-full max-w-[480px] p-8 rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
      <h2 className="text-xl font-bold text-red-500">오류가 발생했습니다!</h2>
      <p className="text-sm text-slate-500 break-all">
        {error.message || "서버 통신 중 에러가 발생했거나 데이터를 불러올 수 없습니다."}
      </p>
      <button
        onClick={() => reset()}
        className="bg-brand hover:bg-brand-hover text-white py-2 px-5 text-sm font-semibold rounded-lg transition-colors cursor-pointer active:scale-95 border-none"
      >
        다시 시도
      </button>
    </div>
  );
}
