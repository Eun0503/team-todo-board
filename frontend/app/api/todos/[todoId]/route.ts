// 개별 투두 수정(PUT) 및 삭제(DELETE) 백엔드 연동 API 프록시 라우트
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function PUT(request: Request, { params }: { params: Promise<{ todoId: string }> }) {
    try {
        const todoId = (await params).todoId;
        const body = await request.json();
        const res = await axios.put(`${BACKEND_URL}/todos/${todoId}`, body);
        return NextResponse.json(res.data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ todoId: string }> }) {
    try {
        const todoId = (await params).todoId;
        const res = await axios.delete(`${BACKEND_URL}/todos/${todoId}`);
        return NextResponse.json(res.data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
