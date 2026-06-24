// Next.js Server Actions (서버 단에서 백엔드 데이터를 Fetch하는 로직)
"use server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function fetchTodos(filter?: string, search?: string) {
    const params = new URLSearchParams();
    if (filter) params.append("filter", filter);
    if (search) params.append("search", search);
    
    const url = `${BACKEND_URL}/todos${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch todos");
    return res.json();
}
