// 루트 경로(/) 접속 시 /todos 경로로 리다이렉트해주는 페이지
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/todos");
}
