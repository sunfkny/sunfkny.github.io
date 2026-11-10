import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTitle } from "../lib/page";

export const Route = createFileRoute("/pay")({ component: PayPage });

function PayPage() {
  useTitle("转账跳转中…");
  const destination = navigator.userAgent.includes("MicroMessenger")
    ? "https://i.loli.net/2019/08/14/MAsf1rUNvin2VjF.png"
    : "https://qr.alipay.com/FKX05303SHMKUP7SQD375B";
  useEffect(() => {
    window.location.replace(destination);
  }, [destination]);
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 text-neutral-600">
      <p role="status">正在跳转…</p>
      <a href={destination} className="underline">
        点击继续
      </a>
    </main>
  );
}
