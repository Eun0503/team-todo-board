// 투두 플래너 메인 페이지 (서버 컴포넌트: 데이터 페칭 담당)
import PlannerContainer from "./PlannerContainer";
import { fetchTodos } from "../actions";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function TodosPage({ searchParams }: HomeProps) {
  const resolvedParams = await searchParams;
  const filter = resolvedParams.filter;

  const initialTodos = await fetchTodos(filter);
  const allTodos = await fetchTodos();

  return (
    <PlannerContainer initialTodos={initialTodos} allTodos={allTodos} />
  );
}
