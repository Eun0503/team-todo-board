// 투두 플래너 데이터 로딩 중 화면 (로딩 스피너/스켈레톤)
export default function Loading() {
  return (
    <div className="todo-container bg-white w-full max-w-[480px] p-8 rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center min-h-[400px]">
      <div className="text-center py-20 text-slate-500 font-semibold animate-pulse">
        로딩 중...
      </div>
    </div>
  );
}
