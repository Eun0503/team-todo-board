// 애플리케이션 루트 레이아웃 (글로벌 폰트 및 구조 설정)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minimalist Todo List",
  description: "React로 제작한 심플하고 직관적인 주간/일간 투두 플래너",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-slate-50 text-slate-800 min-h-screen flex justify-center items-start pt-[16vh] p-5`}>
        <div className="w-full max-w-[480px]">
          {children}
        </div>
      </body>
    </html>
  );
}
