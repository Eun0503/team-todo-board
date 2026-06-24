// 전체 투두 조회(GET) 및 투두 생성(POST) 백엔드 연동 API 프록시 라우트
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET() {
    try {
        const res = await axios.get(`${BACKEND_URL}/todos`);
        return NextResponse.json(res.data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const res = await axios.post(`${BACKEND_URL}/todos`, body);
        return NextResponse.json(res.data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
